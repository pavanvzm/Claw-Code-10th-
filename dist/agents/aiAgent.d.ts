import { Message } from '../tools/llmProvider.js';
export interface AgentConfig {
    workspaceDir: string;
    maxIterations?: number;
}
export declare class AIAgent {
    private llm;
    private fileSystem;
    private commandExecutor;
    private messageHistory;
    private maxIterations;
    constructor(config: AgentConfig);
    processMessage(userMessage: string): Promise<string>;
    private parseToolCall;
    private executeTool;
    private handleReadFile;
    private handleWriteFile;
    private handlePatchFile;
    private handleListDirectory;
    private handleExecuteCommand;
    clearHistory(): void;
    getHistory(): Message[];
    getHistoryLength(): number;
}
export default AIAgent;
//# sourceMappingURL=aiAgent.d.ts.map