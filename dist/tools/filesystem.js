import fs from 'fs/promises';
import path from 'path';
export class FileSystemAgent {
    workspaceDir;
    constructor(workspaceDir = '.') {
        this.workspaceDir = path.resolve(workspaceDir);
    }
    async readFile(filePath) {
        try {
            const absolutePath = this.resolvePath(filePath);
            await this.validatePath(absolutePath);
            const content = await fs.readFile(absolutePath, 'utf-8');
            return { success: true, content };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error reading file',
            };
        }
    }
    async writeFile(filePath, content) {
        try {
            const absolutePath = this.resolvePath(filePath);
            await this.validatePath(absolutePath);
            // Ensure directory exists
            const dir = path.dirname(absolutePath);
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(absolutePath, content, 'utf-8');
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error writing file',
            };
        }
    }
    async patchFile(filePath, searchStr, replaceStr) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error patching file',
            };
        }
    }
    async listDirectory(dirPath) {
        try {
            const absolutePath = this.resolvePath(dirPath);
            await this.validatePath(absolutePath);
            const files = await fs.readdir(absolutePath);
            return { success: true, files };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error listing directory',
            };
        }
    }
    async fileExists(filePath) {
        try {
            const absolutePath = this.resolvePath(filePath);
            await fs.access(absolutePath);
            return true;
        }
        catch {
            return false;
        }
    }
    resolvePath(filePath) {
        if (path.isAbsolute(filePath)) {
            // For absolute paths, ensure they're within or equal to workspace
            return filePath;
        }
        return path.resolve(this.workspaceDir, filePath);
    }
    async validatePath(absolutePath) {
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
//# sourceMappingURL=filesystem.js.map