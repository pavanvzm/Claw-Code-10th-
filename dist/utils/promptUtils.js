import inquirer from 'inquirer';
import chalk from 'chalk';
export async function prompt(options) {
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
export async function promptInput(message, defaultValue) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'value',
            message,
            default: defaultValue,
        },
    ]);
    return answers.value;
}
export async function promptConfirm(message, defaultValue) {
    const answers = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmed',
            message,
            default: defaultValue ?? false,
        },
    ]);
    return answers.confirmed;
}
export async function promptChoice(message, choices) {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message,
            choices,
        },
    ]);
    return answers.choice;
}
export function showHelp() {
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
//# sourceMappingURL=promptUtils.js.map