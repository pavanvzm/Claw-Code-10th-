import chalk from 'chalk';

export class Logger {
  private static prefix = '[AI Assistant]';

  static info(message: string): void {
    console.log(`${chalk.blue(this.prefix)} ${message}`);
  }

  static success(message: string): void {
    console.log(`${chalk.green(this.prefix)} ${chalk.green('✓')} ${message}`);
  }

  static error(message: string): void {
    console.log(`${chalk.red(this.prefix)} ${chalk.red('✗')} ${message}`);
  }

  static warning(message: string): void {
    console.log(`${chalk.yellow(this.prefix)} ${chalk.yellow('⚠')} ${message}`);
  }

  static debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      console.log(`${chalk.gray(this.prefix)} ${chalk.gray(message)}`);
    }
  }

  static toolCall(toolName: string, args?: Record<string, unknown>): void {
    console.log(`${chalk.cyan(this.prefix)} ${chalk.cyan('🔧')} Calling tool: ${chalk.bold(toolName)}`);
    if (args && process.env.DEBUG === 'true') {
      console.log(chalk.gray(JSON.stringify(args, null, 2)));
    }
  }

  static command(command: string): void {
    console.log(`${chalk.magenta(this.prefix)} ${chalk.magenta('▶')} Executing: ${chalk.bold(command)}`);
  }

  static fileOperation(operation: 'read' | 'write' | 'patch', filePath: string): void {
    const icons = { read: '📖', write: '✍️', patch: '🔧' };
    const colors = { read: chalk.blue, write: chalk.green, patch: chalk.yellow };
    console.log(`${colors[operation](this.prefix)} ${colors[operation](icons[operation])} ${operation.toUpperCase()}: ${chalk.bold(filePath)}`);
  }

  static response(content: string, maxLength: number = 500): void {
    const truncated = content.length > maxLength 
      ? content.substring(0, maxLength) + chalk.gray('... (truncated)')
      : content;
    console.log(`${chalk.white(this.prefix)} ${truncated}`);
  }
}

export default Logger;
