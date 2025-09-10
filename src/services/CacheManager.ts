import { AnalysisReport } from '../models/AnalysisReport';
import { CacheStats } from '../models/Types';
import NodeCache from 'node-cache';

export class CacheManager {
  private memoryCache: NodeCache;
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
  };

  constructor() {
    // Initialize with 1 hour default TTL
    this.memoryCache = new NodeCache({ 
      stdTTL: 3600,
      checkperiod: 600, // Check for expired keys every 10 minutes
    });
  }

  async get(key: string): Promise<AnalysisReport | null> {
    const cached = this.memoryCache.get(key);
    
    if (cached) {
      this.stats.hits++;
      return cached as AnalysisReport;
    } else {
      this.stats.misses++;
      return null;
    }
  }

  async set(key: string, value: AnalysisReport, ttl: number): Promise<boolean> {
    try {
      const success = this.memoryCache.set(key, value, ttl);
      if (success) {
        this.stats.sets++;
      }
      return success;
    } catch (error) {
      return false;
    }
  }

  async clear(): Promise<number> {
    const keys = this.memoryCache.keys();
    const count = keys.length;
    this.memoryCache.flushAll();
    
    // Reset stats
    this.stats = { hits: 0, misses: 0, sets: 0 };
    
    return count;
  }

  async cleanExpired(): Promise<number> {
    const keysBefore = this.memoryCache.keys().length;
    
    // NodeCache automatically removes expired keys, but we can force a check
    this.memoryCache.keys(); // This triggers cleanup
    
    const keysAfter = this.memoryCache.keys().length;
    return keysBefore - keysAfter;
  }

  async getStats(): Promise<CacheStats> {
    const keys = this.memoryCache.keys();
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    // Get oldest entry
    let oldestEntry: Date | undefined;
    for (const key of keys) {
      const data = this.memoryCache.get(key) as AnalysisReport;
      if (data && data.timestamp) {
        if (!oldestEntry || data.timestamp < oldestEntry) {
          oldestEntry = data.timestamp;
        }
      }
    }

    // Estimate cache size (rough calculation)
    const sizeInMB = (JSON.stringify(this.memoryCache.keys().map(k => this.memoryCache.get(k))).length) / (1024 * 1024);

    return {
      totalEntries: keys.length,
      sizeInMB: Math.round(sizeInMB * 100) / 100, // Round to 2 decimal places
      hitRate: Math.round(hitRate * 100) / 100,
      oldestEntry,
    };
  }

  /**
   * Check if cache has reached capacity limits
   */
  isNearCapacity(): boolean {
    return this.memoryCache.keys().length > 10000; // 10k entries limit
  }

  /**
   * Get cache key for a package
   */
  static getCacheKey(packageName: string, packageVersion: string): string {
    return `${packageName}@${packageVersion}`;
  }

  /**
   * Validate cache key format
   */
  static isValidCacheKey(key: string): boolean {
    return /^[a-zA-Z0-9][a-zA-Z0-9-._]*@[\d\w.-]+$/.test(key);
  }
}