import { exec } from 'child_process';
import { promisify } from 'util';
import config from '../config/index.js';

const execAsync = promisify(exec);

export interface CommandExecutionResult {
  success: boolean;
  stdout?: string;
  stderr?: string;
  error?: string;
  command: string;
}

export class CommandExecutor {
  private allowedCommands: string[];
  private blockedCommands: string[];

  constructor() {
    this.allowedCommands = config.allowedCommands.length > 0 
      ? config.allowedCommands 
      : ['ls', 'cat', 'grep', 'find', 'pwd', 'echo', 'mkdir', 'cp', 'mv', 'rm', 'git', 'npm', 'npx', 'node'];
    this.blockedCommands = config.blockedCommands.length > 0 
      ? config.blockedCommands 
      : ['sudo', 'su', 'chmod 777', 'dd', 'mkfs', 'fdisk'];
  }

  async execute(command: string): Promise<CommandExecutionResult> {
    // Security validation
    const validationError = this.validateCommand(command);
    if (validationError) {
      return {
        success: false,
        error: validationError,
        command,
      };
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 60000, // 60 second timeout
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        cwd: config.workspaceDir,
      });

      return {
        success: true,
        stdout,
        stderr,
        command,
      };
    } catch (error) {
      const err = error as Error & { stdout?: string; stderr?: string };
      return {
        success: false,
        stdout: err.stdout || '',
        stderr: err.stderr || '',
        error: err.message,
        command,
      };
    }
  }

  private validateCommand(command: string): string | null {
    const trimmedCommand = command.trim().toLowerCase();

    // Check for blocked commands/patterns
    for (const blocked of this.blockedCommands) {
      if (trimmedCommand.includes(blocked.toLowerCase())) {
        return `Command blocked for security reasons: contains "${blocked}"`;
      }
    }

    // Check if command starts with an allowed command
    const firstWord = trimmedCommand.split(/\s+/)[0];
    
    // Allow pipe and redirect operations by checking the base command
    const baseCommand = trimmedCommand.split('|')[0].split('>')[0].split('&&')[0].split(';')[0].trim().split(/\s+/)[0];
    
    if (!this.allowedCommands.includes(baseCommand) && this.allowedCommands.length > 0) {
      // If we have a whitelist, check against it
      // Be lenient - allow most commands but block dangerous ones
      const dangerousPatterns = [
        '^sudo', '^su\\b', '^rm\\s+--no-preserve-root', 
        '^dd\\b', '^mkfs', '^fdisk', '^wget.*\\|.*sh',
        '^curl.*\\|.*sh', '^chmod\\s+777'
      ];
      
      for (const pattern of dangerousPatterns) {
        if (new RegExp(pattern).test(trimmedCommand)) {
          return `Command blocked for security reasons: matches dangerous pattern`;
        }
      }
    }

    return null;
  }

  getHelpText(): string {
    return `Available commands (not exhaustive - dangerous commands are blocked):
Common: ls, cat, grep, find, pwd, echo, mkdir, cp, mv, rm
Development: git, npm, npx, node
Note: Commands containing sudo, su, chmod 777, dd, mkfs, fdisk are blocked.`;
  }
}

export default CommandExecutor;
