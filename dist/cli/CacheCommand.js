"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheCommand = void 0;
const CacheManager_1 = require("../services/CacheManager");
class CacheCommand {
    constructor() {
        this.cacheManager = new CacheManager_1.CacheManager();
    }
    async execute(args, options = {}) {
        if (args.length === 0) {
            throw new Error('Cache subcommand required');
        }
        const subcommand = args[0];
        switch (subcommand) {
            case 'clear':
                return await this.handleClear(options.force || false);
            case 'info':
                return await this.handleInfo();
            case 'clean':
                return await this.handleClean();
            default:
                throw new Error('Invalid cache subcommand');
        }
    }
    async clearCache(force) {
        if (!force && this.promptConfirmation) {
            const confirmed = await this.promptConfirmation();
            if (!confirmed) {
                return 0;
            }
        }
        return await this.cacheManager.clear();
    }
    async getCacheInfo() {
        return await this.cacheManager.getStats();
    }
    async cleanExpired() {
        return await this.cacheManager.cleanExpired();
    }
    async handleClear(force) {
        const count = await this.clearCache(force);
        console.log(`Cleared ${count} cache entries`);
        return 0;
    }
    async handleInfo() {
        const info = await this.getCacheInfo();
        console.log(`Total cached analyses: ${info.totalEntries}`);
        console.log(`Cache size: ${info.sizeInMB} MB`);
        if (info.oldestEntry) {
            console.log(`Oldest entry: ${info.oldestEntry.toISOString().split('T')[0]}`);
        }
        console.log(`Cache hit rate: ${info.hitRate}%`);
        return 0;
    }
    async handleClean() {
        const count = await this.cleanExpired();
        console.log(`Cleaned ${count} expired entries`);
        return 0;
    }
}
exports.CacheCommand = CacheCommand;
//# sourceMappingURL=CacheCommand.js.map