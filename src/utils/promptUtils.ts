import inquirer from 'inquirer';
import chalk from 'chalk';

export interface PromptOptions {
  type: 'input' | 'confirm' | 'list' | 'checkbox';
  name: string;
  message: string;
  default?: unknown;
  choices?: string[];
}

export async function prompt(options: PromptOptions): Promise<unknown> {
  const answers = await inquirer.prompt([
    {
      type: options.type,
      name: options.name,
      message: options.message,
      default: options.default,
      choices: options.choices,
    },
  ]);
  
  return answers[options.name];
}

export async function promptInput(message: string, defaultValue?: string): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message,
      default: defaultValue,
    },
  ]);
  
  return answers.value as string;
}

export async function promptConfirm(message: string, defaultValue?: boolean): Promise<boolean> {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: defaultValue ?? false,
    },
  ]);
  
  return answers.confirmed as boolean;
}

export async function promptChoice(message: string, choices: string[]): Promise<string> {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message,
      choices,
    },
  ]);
  
  return answers.choice as string;
}

export function showHelp(): void {
  console.log(`
${chalk.bold('Terminal AI Assistant - Help')}

${chalk.cyan('Commands:')}
  ${chalk.yellow('/help')}     - Show this help message
  ${chalk.yellow('/clear')}    - Clear the conversation history
  ${chalk.yellow('/config')}   - Show current configuration
  ${chalk.yellow('/tools')}    - List available tools
  ${chalk.yellow('/exit')}     - Exit the assistant

${chalk.cyan('Usage Examples:')}
  - "Create a new React component in src/components"
  - "Read the package.json file"
  - "Run npm install and tell me what happens"
  - "Fix the bug in app.ts line 42"
  - "List all files in the current directory"

${chalk.cyan('Tips:')}
  - Be specific about file paths when asking for file operations
  - The assistant can execute commands and self-correct based on errors
  - All file operations are restricted to the workspace directory
`);
}

export default {
  prompt,
  promptInput,
  promptConfirm,
  promptChoice,
  showHelp,
};
