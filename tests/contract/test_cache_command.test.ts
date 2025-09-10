import { CacheCommand } from '../../src/cli/CacheCommand';

describe('CacheCommand Contract', () => {
  let cacheCommand: CacheCommand;

  beforeEach(() => {
    cacheCommand = new CacheCommand();
  });

  describe('CLI Interface', () => {
    it('should support clear subcommand', async () => {
      const args = ['clear'];
      const options = {};
      
      expect(() => cacheCommand.execute(args, options)).not.toThrow();
    });

    it('should support info subcommand', async () => {
      const args = ['info'];
      const options = {};
      
      expect(() => cacheCommand.execute(args, options)).not.toThrow();
    });

    it('should support clean subcommand', async () => {
      const args = ['clean'];
      const options = {};
      
      expect(() => cacheCommand.execute(args, options)).not.toThrow();
    });

    it('should support --force option for clear', async () => {
      const args = ['clear'];
      const options = { force: true };
      
      expect(() => cacheCommand.execute(args, options)).not.toThrow();
    });
  });

  describe('Cache Operations', () => {
    it('should clear all cache entries', async () => {
      const result = await cacheCommand.clearCache(true);
      expect(typeof result).toBe('number');
    });

    it('should return cache info', async () => {
      const info = await cacheCommand.getCacheInfo();
      expect(info).toHaveProperty('totalEntries');
      expect(info).toHaveProperty('sizeInMB');
      expect(info).toHaveProperty('oldestEntry');
      expect(info).toHaveProperty('hitRate');
    });

    it('should clean expired entries', async () => {
      const result = await cacheCommand.cleanExpired();
      expect(typeof result).toBe('number');
    });

    it('should prompt for confirmation when force is false', async () => {
      const mockPrompt = jest.fn().mockResolvedValue(true);
      cacheCommand.promptConfirmation = mockPrompt;
      
      await cacheCommand.clearCache(false);
      expect(mockPrompt).toHaveBeenCalled();
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid subcommand', async () => {
      const args = ['invalid'];
      const options = {};
      
      await expect(cacheCommand.execute(args, options)).rejects.toThrow('Invalid cache subcommand');
    });

    it('should require subcommand', async () => {
      const args: string[] = [];
      const options = {};
      
      await expect(cacheCommand.execute(args, options)).rejects.toThrow('Cache subcommand required');
    });
  });
});