export declare class Logger {
    private static prefix;
    static info(message: string): void;
    static success(message: string): void;
    static error(message: string): void;
    static warning(message: string): void;
    static debug(message: string): void;
    static toolCall(toolName: string, args?: Record<string, unknown>): void;
    static command(command: string): void;
    static fileOperation(operation: 'read' | 'write' | 'patch', filePath: string): void;
    static response(content: string, maxLength?: number): void;
}
export default Logger;
//# sourceMappingURL=logger.d.ts.map