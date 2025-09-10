export declare class ConfigCommand {
    private config;
    execute(args: string[], options?: any): Promise<number>;
    setConfig(key: string, value: string): Promise<void>;
    getConfig(key: string): Promise<string | null>;
    listConfig(): Promise<Record<string, string>>;
    validateApiKey(key: string): Promise<boolean>;
    validateCacheTtl(ttl: string): Promise<boolean>;
    private handleSet;
    private handleGet;
    private handleList;
}
//# sourceMappingURL=ConfigCommand.d.ts.map