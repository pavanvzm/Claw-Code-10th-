export interface CommandExecutionResult {
    success: boolean;
    stdout?: string;
    stderr?: string;
    error?: string;
    command: string;
}
export declare class CommandExecutor {
    private allowedCommands;
    private blockedCommands;
    constructor();
    execute(command: string): Promise<CommandExecutionResult>;
    private validateCommand;
    getHelpText(): string;
}
export default CommandExecutor;
//# sourceMappingURL=commandExecutor.d.ts.map