export interface Config {
    llmProvider: 'ollama' | 'openrouter';
    ollamaBaseUrl: string;
    ollamaModel: string;
    openRouterApiKey: string;
    openRouterModel: string;
    maxTokens: number;
    temperature: number;
    workspaceDir: string;
    allowedCommands: string[];
    blockedCommands: string[];
}
export declare const config: Config;
export default config;
//# sourceMappingURL=index.d.ts.map