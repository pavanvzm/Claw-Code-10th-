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
export declare class FileSystemAgent {
    private workspaceDir;
    constructor(workspaceDir?: string);
    readFile(filePath: string): Promise<FileReadResult>;
    writeFile(filePath: string, content: string): Promise<FileWriteResult>;
    patchFile(filePath: string, searchStr: string, replaceStr: string): Promise<FilePatchResult>;
    listDirectory(dirPath: string): Promise<{
        success: boolean;
        files?: string[];
        error?: string;
    }>;
    fileExists(filePath: string): Promise<boolean>;
    private resolvePath;
    private validatePath;
}
export default FileSystemAgent;
//# sourceMappingURL=filesystem.d.ts.map