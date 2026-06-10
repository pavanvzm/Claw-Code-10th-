export interface PromptOptions {
    type: 'input' | 'confirm' | 'list' | 'checkbox';
    name: string;
    message: string;
    default?: unknown;
    choices?: string[];
}
export declare function prompt(options: PromptOptions): Promise<unknown>;
export declare function promptInput(message: string, defaultValue?: string): Promise<string>;
export declare function promptConfirm(message: string, defaultValue?: boolean): Promise<boolean>;
export declare function promptChoice(message: string, choices: string[]): Promise<string>;
export declare function showHelp(): void;
declare const _default: {
    prompt: typeof prompt;
    promptInput: typeof promptInput;
    promptConfirm: typeof promptConfirm;
    promptChoice: typeof promptChoice;
    showHelp: typeof showHelp;
};
export default _default;
//# sourceMappingURL=promptUtils.d.ts.map