import { CacheManager } from '../services/CacheManager';

export interface CacheCommandOptions {
  force?: boolean;
}

export class CacheCommand {
  private cacheManager: CacheManager;
  public promptConfirmation?: () => Promise<boolean>;

  constructor() {
    this.cacheManager = new CacheManager();
  }

  async execute(args: string[], options: CacheCommandOptions = {}): Promise<number> {
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

  async clearCache(force: boolean): Promise<number> {
    if (!force && this.promptConfirmation) {
      const confirmed = await this.promptConfirmation();
      if (!confirmed) {
        return 0;
      }
    }

    return await this.cacheManager.clear();
  }

  async getCacheInfo(): Promise<any> {
    return await this.cacheManager.getStats();
  }

  async cleanExpired(): Promise<number> {
    return await this.cacheManager.cleanExpired();
  }

  private async handleClear(force: boolean): Promise<number> {
    const count = await this.clearCache(force);
    console.log(`Cleared ${count} cache entries`);
    return 0;
  }

  private async handleInfo(): Promise<number> {
    const info = await this.getCacheInfo();
    console.log(`Total cached analyses: ${info.totalEntries}`);
    console.log(`Cache size: ${info.sizeInMB} MB`);
    if (info.oldestEntry) {
      console.log(`Oldest entry: ${info.oldestEntry.toISOString().split('T')[0]}`);
    }
    console.log(`Cache hit rate: ${info.hitRate}%`);
    return 0;
  }

  private async handleClean(): Promise<number> {
    const count = await this.cleanExpired();
    console.log(`Cleaned ${count} expired entries`);
    return 0;
  }
}