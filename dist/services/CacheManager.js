"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
class CacheManager {
    constructor() {
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
        };
        this.memoryCache = new node_cache_1.default({
            stdTTL: 3600,
            checkperiod: 600,
        });
    }
    async get(key) {
        const cached = this.memoryCache.get(key);
        if (cached) {
            this.stats.hits++;
            return cached;
        }
        else {
            this.stats.misses++;
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            const success = this.memoryCache.set(key, value, ttl);
            if (success) {
                this.stats.sets++;
            }
            return success;
        }
        catch (error) {
            return false;
        }
    }
    async clear() {
        const keys = this.memoryCache.keys();
        const count = keys.length;
        this.memoryCache.flushAll();
        this.stats = { hits: 0, misses: 0, sets: 0 };
        return count;
    }
    async cleanExpired() {
        const keysBefore = this.memoryCache.keys().length;
        this.memoryCache.keys();
        const keysAfter = this.memoryCache.keys().length;
        return keysBefore - keysAfter;
    }
    async getStats() {
        const keys = this.memoryCache.keys();
        const totalRequests = this.stats.hits + this.stats.misses;
        const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
        let oldestEntry;
        for (const key of keys) {
            const data = this.memoryCache.get(key);
            if (data && data.timestamp) {
                if (!oldestEntry || data.timestamp < oldestEntry) {
                    oldestEntry = data.timestamp;
                }
            }
        }
        const sizeInMB = (JSON.stringify(this.memoryCache.keys().map(k => this.memoryCache.get(k))).length) / (1024 * 1024);
        return {
            totalEntries: keys.length,
            sizeInMB: Math.round(sizeInMB * 100) / 100,
            hitRate: Math.round(hitRate * 100) / 100,
            oldestEntry,
        };
    }
    isNearCapacity() {
        return this.memoryCache.keys().length > 10000;
    }
    static getCacheKey(packageName, packageVersion) {
        return `${packageName}@${packageVersion}`;
    }
    static isValidCacheKey(key) {
        return /^[a-zA-Z0-9][a-zA-Z0-9-._]*@[\d\w.-]+$/.test(key);
    }
}
exports.CacheManager = CacheManager;
//# sourceMappingURL=CacheManager.js.map