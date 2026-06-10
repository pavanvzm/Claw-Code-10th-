import axios from 'axios';
import OpenAI from 'openai';
import config from '../config/index.js';

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

abstract class LLMProvider {
  protected systemPrompt: string;

  constructor(systemPrompt: string) {
    this.systemPrompt = systemPrompt;
  }

  abstract chat(messages: Message[]): Promise<LLMResponse>;
  abstract chatWithTools(messages: Message[], tools?: unknown[]): Promise<LLMResponseWithTool>;
}

export class OllamaProvider extends LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor(systemPrompt: string) {
    super(systemPrompt);
    this.baseUrl = config.ollamaBaseUrl;
    this.model = config.ollamaModel;
  }

  async chat(messages: Message[]): Promise<LLMResponse> {
    try {
      const ollamaMessages = [
        { role: 'system' as const, content: this.systemPrompt },
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
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
    } catch (error) {
      const err = error as Error & { response?: { data?: unknown } };
      return {
        success: false,
        error: `Ollama error: ${err.message}${err.response?.data ? ' - ' + JSON.stringify(err.response.data) : ''}`,
      };
    }
  }

  async chatWithTools(messages: Message[], tools?: unknown[]): Promise<LLMResponseWithTool> {
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
  private apiKey: string;
  private model: string;
  private client: OpenAI;

  constructor(systemPrompt: string) {
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

  async chat(messages: Message[]): Promise<LLMResponse> {
    try {
      const openAiMessages = [
        { role: 'system' as const, content: this.systemPrompt },
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
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: `OpenRouter error: ${err.message}`,
      };
    }
  }

  async chatWithTools(messages: Message[], tools?: unknown[]): Promise<LLMResponseWithTool> {
    try {
      const openAiMessages = [
        { role: 'system' as const, content: this.systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ];

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: openAiMessages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        tools: tools as OpenAI.Chat.Completions.ChatCompletionTool[],
      });

      const choice = completion.choices[0];
      const toolCalls: ToolCall[] = [];

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
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: `OpenRouter error: ${err.message}`,
      };
    }
  }
}

export function createLLMProvider(systemPrompt: string): LLMProvider {
  if (config.llmProvider === 'ollama') {
    return new OllamaProvider(systemPrompt);
  } else {
    return new OpenRouterProvider(systemPrompt);
  }
}

export default createLLMProvider;
