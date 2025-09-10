export interface WithdrawnCommandOptions {
    format?: string;
    output?: string;
    verbose?: boolean;
}
export declare class WithdrawnCommand {
    private detector;
    private npmClient;
    constructor();
    execute(args: string[], options?: WithdrawnCommandOptions): Promise<number>;
}
//# sourceMappingURL=WithdrawnCommand.d.ts.map