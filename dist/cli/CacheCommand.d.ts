export interface CacheCommandOptions {
    force?: boolean;
}
export declare class CacheCommand {
    private cacheManager;
    promptConfirmation?: () => Promise<boolean>;
    constructor();
    execute(args: string[], options?: CacheCommandOptions): Promise<number>;
    clearCache(force: boolean): Promise<number>;
    getCacheInfo(): Promise<any>;
    cleanExpired(): Promise<number>;
    private handleClear;
    private handleInfo;
    private handleClean;
}
//# sourceMappingURL=CacheCommand.d.ts.map