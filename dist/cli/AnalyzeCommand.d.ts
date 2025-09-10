export interface AnalyzeCommandOptions {
    version?: string;
    format?: string;
    output?: string;
    depth?: number;
    cache?: boolean;
    severity?: string;
    timeout?: number;
}
export declare class AnalyzeCommand {
    private analyzer;
    private npmClient;
    private reportGenerator;
    private cacheManager;
    constructor();
    execute(args: string[], options?: AnalyzeCommandOptions): Promise<number>;
    private validateInput;
}
//# sourceMappingURL=AnalyzeCommand.d.ts.map