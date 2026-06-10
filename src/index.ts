#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import AIAgent from './agents/aiAgent.js';
import config from './config/index.js';
import Logger from './utils/logger.js';
import { showHelp } from './utils/promptUtils.js';

const program = new Command();

program
  .name('terminal-ai')
  .description('A terminal-based AI coding assistant (Claude Code clone)')
  .version('1.0.0');

program
  .option('-w, --workspace <path>', 'Workspace directory', '.')
  .option('-v, --verbose', 'Enable verbose/debug output', false)
  .option('-c, --config', 'Show current configuration')
  .action(async (options) => {
    if (options.config) {
      console.log(chalk.bold('\nCurrent Configuration:'));
      console.log(`  LLM Provider: ${chalk.cyan(config.llmProvider)}`);
      console.log(`  Ollama URL: ${chalk.cyan(config.ollamaBaseUrl)}`);
      console.log(`  Ollama Model: ${chalk.cyan(config.ollamaModel)}`);
      console.log(`  OpenRouter Model: ${chalk.cyan(config.openRouterModel)}`);
      console.log(`  Workspace: ${chalk.cyan(config.workspaceDir)}`);
      console.log(`  Max Tokens: ${chalk.cyan(config.maxTokens)}`);
      console.log(`  Temperature: ${chalk.cyan(config.temperature)}`);
      return;
    }

    // Initialize the agent
    const workspaceDir = options.workspace || '.';
    const agent = new AIAgent({ workspaceDir });

    if (options.verbose) {
      process.env.DEBUG = 'true';
    }

    // Welcome message
    console.log(chalk.bold.green('\n🤖 Terminal AI Assistant'));
    console.log(chalk.gray('A free, open-source Claude Code alternative\n'));
    console.log(chalk.cyan(`Workspace: ${workspaceDir}`));
    console.log(chalk.cyan(`LLM Provider: ${config.llmProvider} (${config.llmProvider === 'ollama' ? config.ollamaModel : config.openRouterModel})`));
    console.log(chalk.gray('\nType /help for available commands, /exit to quit\n'));

    // Main interaction loop
    while (true) {
      try {
        const { userInput } = await inquirer.prompt([
          {
            type: 'input',
            name: 'userInput',
            message: chalk.green('❯'),
            prefix: '',
          },
        ]);

        const input = (userInput || '').trim();

        if (!input) {
          continue;
        }

        // Handle slash commands
        if (input.startsWith('/')) {
          const command = input.toLowerCase().split(' ')[0];

          switch (command) {
            case '/help':
              showHelp();
              break;

            case '/clear':
              agent.clearHistory();
              Logger.success('Conversation history cleared');
              break;

            case '/config':
              console.log(chalk.bold('\nCurrent Configuration:'));
              console.log(`  LLM Provider: ${chalk.cyan(config.llmProvider)}`);
              console.log(`  Ollama URL: ${chalk.cyan(config.ollamaBaseUrl)}`);
              console.log(`  Ollama Model: ${chalk.cyan(config.ollamaModel)}`);
              console.log(`  OpenRouter Model: ${chalk.cyan(config.openRouterModel)}`);
              console.log(`  Workspace: ${chalk.cyan(workspaceDir)}`);
              console.log(`  Max Tokens: ${chalk.cyan(config.maxTokens)}`);
              console.log(`  Temperature: ${chalk.cyan(config.temperature)}`);
              console.log(`  History Length: ${chalk.cyan(agent.getHistoryLength())}`);
              break;

            case '/tools':
              console.log(chalk.bold('\nAvailable Tools:'));
              console.log('  read_file     - Read contents of a file');
              console.log('  write_file    - Create or overwrite a file');
              console.log('  patch_file    - Replace text in a file (search and replace)');
              console.log('  list_directory - List files in a directory');
              console.log('  execute_command - Run a terminal command');
              break;

            case '/exit':
            case '/quit':
              console.log(chalk.yellow('\n👋 Goodbye!\n'));
              process.exit(0);
              break;

            default:
              Logger.warning(`Unknown command: ${command}. Type /help for available commands.`);
          }

          continue;
        }

        // Process the user's message
        Logger.info('Processing...');
        
        const response = await agent.processMessage(input);
        
        if (response) {
          console.log('\n' + chalk.white(response) + '\n');
        }

      } catch (error) {
        if ((error as any).isTtyError) {
          // Inquirer handled the TTY error
          Logger.error('Terminal error occurred');
          process.exit(1);
        } else {
          Logger.error((error as Error).message);
        }
      }
    }
  });

program.parse(process.argv);
