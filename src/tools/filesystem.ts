import fs from 'fs/promises';
import path from 'path';

export interface FileReadResult {
  success: boolean;
  content?: string;
  error?: string;
}

export interface FileWriteResult {
  success: boolean;
  error?: string;
}

export interface FilePatchResult {
  success: boolean;
  oldContent?: string;
  newContent?: string;
  error?: string;
}

export class FileSystemAgent {
  private workspaceDir: string;

  constructor(workspaceDir: string = '.') {
    this.workspaceDir = path.resolve(workspaceDir);
  }

  async readFile(filePath: string): Promise<FileReadResult> {
    try {
      const absolutePath = this.resolvePath(filePath);
      await this.validatePath(absolutePath);
      
      const content = await fs.readFile(absolutePath, 'utf-8');
      return { success: true, content };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error reading file',
      };
    }
  }

  async writeFile(filePath: string, content: string): Promise<FileWriteResult> {
    try {
      const absolutePath = this.resolvePath(filePath);
      await this.validatePath(absolutePath);
      
      // Ensure directory exists
      const dir = path.dirname(absolutePath);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.writeFile(absolutePath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error writing file',
      };
    }
  }

  async patchFile(filePath: string, searchStr: string, replaceStr: string): Promise<FilePatchResult> {
    try {
      const absolutePath = this.resolvePath(filePath);
      await this.validatePath(absolutePath);
      
      const oldContent = await fs.readFile(absolutePath, 'utf-8');
      
      if (!oldContent.includes(searchStr)) {
        return {
          success: false,
          oldContent,
          error: 'Search string not found in file',
        };
      }
      
      const newContent = oldContent.replace(searchStr, replaceStr);
      await fs.writeFile(absolutePath, newContent, 'utf-8');
      
      return {
        success: true,
        oldContent,
        newContent,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error patching file',
      };
    }
  }

  async listDirectory(dirPath: string): Promise<{ success: boolean; files?: string[]; error?: string }> {
    try {
      const absolutePath = this.resolvePath(dirPath);
      await this.validatePath(absolutePath);
      
      const files = await fs.readdir(absolutePath);
      return { success: true, files };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error listing directory',
      };
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const absolutePath = this.resolvePath(filePath);
      await fs.access(absolutePath);
      return true;
    } catch {
      return false;
    }
  }

  private resolvePath(filePath: string): string {
    if (path.isAbsolute(filePath)) {
      // For absolute paths, ensure they're within or equal to workspace
      return filePath;
    }
    return path.resolve(this.workspaceDir, filePath);
  }

  private async validatePath(absolutePath: string): Promise<void> {
    // Security: Ensure path is within workspace directory
    const normalizedWorkspace = path.resolve(this.workspaceDir);
    const normalizedPath = path.resolve(absolutePath);
    
    // Allow paths that are within workspace or exactly the workspace
    if (!normalizedPath.startsWith(normalizedWorkspace) && normalizedPath !== normalizedWorkspace) {
      throw new Error(`Access denied: Path "${absolutePath}" is outside workspace directory`);
    }
  }
}

export default FileSystemAgent;
