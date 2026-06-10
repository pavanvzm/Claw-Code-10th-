import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

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

const parseCommaSeparated = (value: string | undefined): string[] => {
  if (!value) return [];
  return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
};

export const config: Config = {
  llmProvider: (process.env.LLM_PROVIDER as 'ollama' | 'openrouter') || 'ollama',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b',
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openRouterModel: process.env.OPENROUTER_MODEL || 'google/gemma-2-9b-it:free',
  maxTokens: parseInt(process.env.MAX_TOKENS || '4096', 10),
  temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
  workspaceDir: process.env.WORKSPACE_DIR || '.',
  allowedCommands: parseCommaSeparated(process.env.ALLOWED_COMMANDS),
  blockedCommands: parseCommaSeparated(process.env.BLOCKED_COMMANDS),
};

export default config;
