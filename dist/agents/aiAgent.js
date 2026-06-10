import FileSystemAgent from '../tools/filesystem.js';
import CommandExecutor from '../tools/commandExecutor.js';
import createLLMProvider from '../tools/llmProvider.js';
import Logger from '../utils/logger.js';
import { SYSTEM_PROMPT } from '../utils/prompts.js';
export class AIAgent {
    llm;
    fileSystem;
    commandExecutor;
    messageHistory;
    maxIterations;
    constructor(config) {
        this.fileSystem = new FileSystemAgent(config.workspaceDir);
        this.commandExecutor = new CommandExecutor();
        this.llm = createLLMProvider(SYSTEM_PROMPT);
        this.messageHistory = [];
        this.maxIterations = config.maxIterations || 10;
    }
    async processMessage(userMessage) {
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
                Logger.toolCall(toolCall.name, toolCall.arguments);
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
    parseToolCall(content) {
        // Simple pattern matching for tool calls
        // Format: [TOOL: tool_name] {"arg1": "value1", "arg2": "value2"}
        const toolPattern = /\[TOOL:\s*(\w+)\]\s*({[\s\S]*?})/i;
        const match = content.match(toolPattern);
        if (match && match[1] && match[2]) {
            try {
                const args = JSON.parse(match[2]);
                return { name: match[1], arguments: args };
            }
            catch {
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
            }
            catch {
                return null;
            }
        }
        return null;
    }
    async executeTool(toolCall) {
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
    async handleReadFile(args) {
        const filePath = args.path;
        if (!filePath) {
            return { error: 'Missing required argument: path' };
        }
        Logger.fileOperation('read', filePath);
        const result = await this.fileSystem.readFile(filePath);
        if (result.success) {
            return { success: true, content: result.content, path: filePath };
        }
        else {
            return { success: false, error: result.error };
        }
    }
    async handleWriteFile(args) {
        const filePath = args.path;
        const content = args.content;
        if (!filePath || content === undefined) {
            return { error: 'Missing required arguments: path and/or content' };
        }
        Logger.fileOperation('write', filePath);
        const result = await this.fileSystem.writeFile(filePath, content);
        if (result.success) {
            return { success: true, path: filePath };
        }
        else {
            return { success: false, error: result.error };
        }
    }
    async handlePatchFile(args) {
        const filePath = args.path;
        const searchStr = args.search;
        const replaceStr = args.replace;
        if (!filePath || !searchStr || replaceStr === undefined) {
            return { error: 'Missing required arguments: path, search, and/or replace' };
        }
        Logger.fileOperation('patch', filePath);
        const result = await this.fileSystem.patchFile(filePath, searchStr, replaceStr);
        if (result.success) {
            return { success: true, path: filePath };
        }
        else {
            return { success: false, error: result.error };
        }
    }
    async handleListDirectory(args) {
        const dirPath = args.path || '.';
        Logger.fileOperation('read', `${dirPath}/`);
        const result = await this.fileSystem.listDirectory(dirPath);
        if (result.success) {
            return { success: true, files: result.files, path: dirPath };
        }
        else {
            return { success: false, error: result.error };
        }
    }
    async handleExecuteCommand(args) {
        const command = args.command;
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
        }
        else {
            return {
                success: false,
                error: result.error,
                stdout: result.stdout,
                stderr: result.stderr,
                command
            };
        }
    }
    clearHistory() {
        this.messageHistory = [];
        Logger.info('Conversation history cleared');
    }
    getHistory() {
        return [...this.messageHistory];
    }
    getHistoryLength() {
        return this.messageHistory.length;
    }
}
export default AIAgent;
//# sourceMappingURL=aiAgent.js.map