import { AnalysisReport } from '../models/AnalysisReport';
import { CacheStats } from '../models/Types';
export declare class CacheManager {
    private memoryCache;
    private stats;
    constructor();
    get(key: string): Promise<AnalysisReport | null>;
    set(key: string, value: AnalysisReport, ttl: number): Promise<boolean>;
    clear(): Promise<number>;
    cleanExpired(): Promise<number>;
    getStats(): Promise<CacheStats>;
    isNearCapacity(): boolean;
    static getCacheKey(packageName: string, packageVersion: string): string;
    static isValidCacheKey(key: string): boolean;
}
//# sourceMappingURL=CacheManager.d.ts.map