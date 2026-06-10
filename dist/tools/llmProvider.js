import axios from 'axios';
import OpenAI from 'openai';
import config from '../config/index.js';
class LLMProvider {
    systemPrompt;
    constructor(systemPrompt) {
        this.systemPrompt = systemPrompt;
    }
}
export class OllamaProvider extends LLMProvider {
    baseUrl;
    model;
    constructor(systemPrompt) {
        super(systemPrompt);
        this.baseUrl = config.ollamaBaseUrl;
        this.model = config.ollamaModel;
    }
    async chat(messages) {
        try {
            const ollamaMessages = [
                { role: 'system', content: this.systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
            ];
            const response = await axios.post(`${this.baseUrl}/api/chat`, {
                model: this.model,
                messages: ollamaMessages,
                stream: false,
                options: {
                    temperature: config.temperature,
                    num_predict: config.maxTokens,
                },
            });
            return {
                success: true,
                content: response.data.message?.content || '',
                model: this.model,
            };
        }
        catch (error) {
            const err = error;
            return {
                success: false,
                error: `Ollama error: ${err.message}${err.response?.data ? ' - ' + JSON.stringify(err.response.data) : ''}`,
            };
        }
    }
    async chatWithTools(messages, tools) {
        // Ollama doesn't have native tool calling in the same way as OpenAI
        // We'll use a prompt-based approach for now
        const result = await this.chat(messages);
        return {
            success: result.success,
            content: result.content,
            error: result.error,
            model: result.model,
        };
    }
}
export class OpenRouterProvider extends LLMProvider {
    apiKey;
    model;
    client;
    constructor(systemPrompt) {
        super(systemPrompt);
        this.apiKey = config.openRouterApiKey;
        this.model = config.openRouterModel;
        this.client = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: this.apiKey,
            defaultHeaders: {
                'HTTP-Referer': 'https://github.com/your-repo/terminal-ai-assistant',
                'X-Title': 'Terminal AI Assistant',
            },
        });
    }
    async chat(messages) {
        try {
            const openAiMessages = [
                { role: 'system', content: this.systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
            ];
            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages: openAiMessages,
                max_tokens: config.maxTokens,
                temperature: config.temperature,
            });
            return {
                success: true,
                content: completion.choices[0]?.message?.content || '',
                model: this.model,
            };
        }
        catch (error) {
            const err = error;
            return {
                success: false,
                error: `OpenRouter error: ${err.message}`,
            };
        }
    }
    async chatWithTools(messages, tools) {
        try {
            const openAiMessages = [
                { role: 'system', content: this.systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })),
            ];
            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages: openAiMessages,
                max_tokens: config.maxTokens,
                temperature: config.temperature,
                tools: tools,
            });
            const choice = completion.choices[0];
            const toolCalls = [];
            if (choice?.message?.tool_calls) {
                for (const tc of choice.message.tool_calls) {
                    if (tc.type === 'function') {
                        toolCalls.push({
                            name: tc.function.name,
                            arguments: JSON.parse(tc.function.arguments),
                        });
                    }
                }
            }
            return {
                success: true,
                content: choice?.message?.content || undefined,
                toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
                model: this.model,
            };
        }
        catch (error) {
            const err = error;
            return {
                success: false,
                error: `OpenRouter error: ${err.message}`,
            };
        }
    }
}
export function createLLMProvider(systemPrompt) {
    if (config.llmProvider === 'ollama') {
        return new OllamaProvider(systemPrompt);
    }
    else {
        return new OpenRouterProvider(systemPrompt);
    }
}
export default createLLMProvider;
//# sourceMappingURL=llmProvider.js.map