export interface ScanCommandOptions {
    file?: string;
    includeDev?: boolean;
    exclude?: string[];
    format?: string;
    output?: string;
}
export declare class ScanCommand {
    execute(args: string[], options?: ScanCommandOptions): Promise<number>;
    parsePackageJson(packageJson: any, options: ScanCommandOptions): Promise<string[]>;
}
//# sourceMappingURL=ScanCommand.d.ts.map