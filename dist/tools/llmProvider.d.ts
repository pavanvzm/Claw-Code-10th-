export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface LLMResponse {
    success: boolean;
    content?: string;
    error?: string;
    model?: string;
}
export interface ToolCall {
    name: string;
    arguments: Record<string, unknown>;
}
export interface LLMResponseWithTool {
    success: boolean;
    content?: string;
    toolCalls?: ToolCall[];
    error?: string;
    model?: string;
}
declare abstract class LLMProvider {
    protected systemPrompt: string;
    constructor(systemPrompt: string);
    abstract chat(messages: Message[]): Promise<LLMResponse>;
    abstract chatWithTools(messages: Message[], tools?: unknown[]): Promise<LLMResponseWithTool>;
}
export declare class OllamaProvider extends LLMProvider {
    private baseUrl;
    private model;
    constructor(systemPrompt: string);
    chat(messages: Message[]): Promise<LLMResponse>;
    chatWithTools(messages: Message[], tools?: unknown[]): Promise<LLMResponseWithTool>;
}
export declare class OpenRouterProvider extends LLMProvider {
    private apiKey;
    private model;
    private client;
    constructor(systemPrompt: string);
    chat(messages: Message[]): Promise<LLMResponse>;
    chatWithTools(messages: Message[], tools?: unknown[]): Promise<LLMResponseWithTool>;
}
export declare function createLLMProvider(systemPrompt: string): LLMProvider;
export default createLLMProvider;
//# sourceMappingURL=llmProvider.d.ts.map