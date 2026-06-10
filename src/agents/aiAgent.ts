import { Message, LLMResponseWithTool, ToolCall } from '../tools/llmProvider.js';
import FileSystemAgent from '../tools/filesystem.js';
import CommandExecutor from '../tools/commandExecutor.js';
import createLLMProvider from '../tools/llmProvider.js';
import Logger from '../utils/logger.js';
import { SYSTEM_PROMPT } from '../utils/prompts.js';

export interface AgentConfig {
  workspaceDir: string;
  maxIterations?: number;
}

export class AIAgent {
  private llm: ReturnType<typeof createLLMProvider>;
  private fileSystem: FileSystemAgent;
  private commandExecutor: CommandExecutor;
  private messageHistory: Message[];
  private maxIterations: number;

  constructor(config: AgentConfig) {
    this.fileSystem = new FileSystemAgent(config.workspaceDir);
    this.commandExecutor = new CommandExecutor();
    this.llm = createLLMProvider(SYSTEM_PROMPT);
    this.messageHistory = [];
    this.maxIterations = config.maxIterations || 10;
  }

  async processMessage(userMessage: string): Promise<string> {
    // Add user message to history
    this.messageHistory.push({ role: 'user', content: userMessage });

    let iterations = 0;
    let finalResponse = '';

    while (iterations < this.maxIterations) {
      iterations++;
      Logger.debug(`Iteration ${iterations}/${this.maxIterations}`);

      // Get response from LLM
      const response = await this.llm.chat(this.messageHistory);

      if (!response.success) {
        Logger.error(response.error || 'Unknown LLM error');
        return `Error: ${response.error}`;
      }

      const assistantContent = response.content || '';

      // Check if the response contains tool calls (using a simple pattern for now)
      const toolCall = this.parseToolCall(assistantContent);

      if (toolCall) {
        Logger.toolCall(toolCall.name, toolCall.arguments as Record<string, unknown>);
        
        // Execute the tool
        const toolResult = await this.executeTool(toolCall);
        
        // Add assistant message and tool result to history
        this.messageHistory.push({ role: 'assistant', content: assistantContent });
        this.messageHistory.push({ 
          role: 'user', 
          content: `Tool result from ${toolCall.name}: ${JSON.stringify(toolResult, null, 2)}` 
        });

        continue; // Continue the loop for follow-up actions
      }

      // No tool call - this is the final response
      finalResponse = assistantContent;
      this.messageHistory.push({ role: 'assistant', content: assistantContent });
      break;
    }

    if (iterations >= this.maxIterations) {
      Logger.warning('Max iterations reached');
      finalResponse += '\n\n[Note: Maximum iteration limit reached]';
    }

    return finalResponse;
  }

  private parseToolCall(content: string): ToolCall | null {
    // Simple pattern matching for tool calls
    // Format: [TOOL: tool_name] {"arg1": "value1", "arg2": "value2"}
    const toolPattern = /\[TOOL:\s*(\w+)\]\s*({[\s\S]*?})/i;
    const match = content.match(toolPattern);

    if (match && match[1] && match[2]) {
      try {
        const args = JSON.parse(match[2]);
        return { name: match[1], arguments: args };
      } catch {
        return null;
      }
    }

    // Alternative format: <tool>tool_name</tool><args>{...}</args>
    const altPattern = /<tool>(\w+)<\/tool>\s*<args>([\s\S]*?)<\/args>/i;
    const altMatch = content.match(altPattern);

    if (altMatch && altMatch[1] && altMatch[2]) {
      try {
        const args = JSON.parse(altMatch[2]);
        return { name: altMatch[1], arguments: args };
      } catch {
        return null;
      }
    }

    return null;
  }

  private async executeTool(toolCall: ToolCall): Promise<unknown> {
    const { name, arguments: args } = toolCall;

    switch (name) {
      case 'read_file':
        return this.handleReadFile(args);
      case 'write_file':
        return this.handleWriteFile(args);
      case 'patch_file':
        return this.handlePatchFile(args);
      case 'list_directory':
        return this.handleListDirectory(args);
      case 'execute_command':
        return this.handleExecuteCommand(args);
      default:
        return { error: `Unknown tool: ${name}` };
    }
  }

  private async handleReadFile(args: Record<string, unknown>): Promise<unknown> {
    const filePath = args.path as string;
    if (!filePath) {
      return { error: 'Missing required argument: path' };
    }

    Logger.fileOperation('read', filePath);
    const result = await this.fileSystem.readFile(filePath);
    
    if (result.success) {
      return { success: true, content: result.content, path: filePath };
    } else {
      return { success: false, error: result.error };
    }
  }

  private async handleWriteFile(args: Record<string, unknown>): Promise<unknown> {
    const filePath = args.path as string;
    const content = args.content as string;

    if (!filePath || content === undefined) {
      return { error: 'Missing required arguments: path and/or content' };
    }

    Logger.fileOperation('write', filePath);
    const result = await this.fileSystem.writeFile(filePath, content);

    if (result.success) {
      return { success: true, path: filePath };
    } else {
      return { success: false, error: result.error };
    }
  }

  private async handlePatchFile(args: Record<string, unknown>): Promise<unknown> {
    const filePath = args.path as string;
    const searchStr = args.search as string;
    const replaceStr = args.replace as string;

    if (!filePath || !searchStr || replaceStr === undefined) {
      return { error: 'Missing required arguments: path, search, and/or replace' };
    }

    Logger.fileOperation('patch', filePath);
    const result = await this.fileSystem.patchFile(filePath, searchStr, replaceStr);

    if (result.success) {
      return { success: true, path: filePath };
    } else {
      return { success: false, error: result.error };
    }
  }

  private async handleListDirectory(args: Record<string, unknown>): Promise<unknown> {
    const dirPath = (args.path as string) || '.';

    Logger.fileOperation('read', `${dirPath}/`);
    const result = await this.fileSystem.listDirectory(dirPath);

    if (result.success) {
      return { success: true, files: result.files, path: dirPath };
    } else {
      return { success: false, error: result.error };
    }
  }

  private async handleExecuteCommand(args: Record<string, unknown>): Promise<unknown> {
    const command = args.command as string;
    if (!command) {
      return { error: 'Missing required argument: command' };
    }

    Logger.command(command);
    const result = await this.commandExecutor.execute(command);

    if (result.success) {
      return { 
        success: true, 
        stdout: result.stdout, 
        stderr: result.stderr,
        command 
      };
    } else {
      return { 
        success: false, 
        error: result.error,
        stdout: result.stdout,
        stderr: result.stderr,
        command 
      };
    }
  }

  clearHistory(): void {
    this.messageHistory = [];
    Logger.info('Conversation history cleared');
  }

  getHistory(): Message[] {
    return [...this.messageHistory];
  }

  getHistoryLength(): number {
    return this.messageHistory.length;
  }
}

export default AIAgent;
