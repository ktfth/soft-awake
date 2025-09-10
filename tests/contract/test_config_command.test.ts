import { ConfigCommand } from '../../src/cli/ConfigCommand';

describe('ConfigCommand Contract', () => {
  let configCommand: ConfigCommand;

  beforeEach(() => {
    configCommand = new ConfigCommand();
  });

  describe('CLI Interface', () => {
    it('should support set subcommand with key and value', async () => {
      const args = ['set', 'api-key', 'test-key'];
      const options = {};
      
      expect(() => configCommand.execute(args, options)).not.toThrow();
    });

    it('should support get subcommand with key', async () => {
      const args = ['get', 'api-key'];
      const options = {};
      
      expect(() => configCommand.execute(args, options)).not.toThrow();
    });

    it('should support list subcommand', async () => {
      const args = ['list'];
      const options = {};
      
      expect(() => configCommand.execute(args, options)).not.toThrow();
    });
  });

  describe('Configuration Operations', () => {
    it('should set configuration value', async () => {
      await configCommand.setConfig('test-key', 'test-value');
      const value = await configCommand.getConfig('test-key');
      expect(value).toBe('test-value');
    });

    it('should get configuration value', async () => {
      await configCommand.setConfig('api-key', 'test-api-key');
      const value = await configCommand.getConfig('api-key');
      expect(value).toBe('test-api-key');
    });

    it('should return null for non-existent key', async () => {
      const value = await configCommand.getConfig('non-existent');
      expect(value).toBeNull();
    });

    it('should list all configuration settings', async () => {
      await configCommand.setConfig('key1', 'value1');
      await configCommand.setConfig('key2', 'value2');
      
      const config = await configCommand.listConfig();
      expect(config).toHaveProperty('key1', 'value1');
      expect(config).toHaveProperty('key2', 'value2');
    });

    it('should validate OpenRouter API key format', async () => {
      const validKey = 'sk-or-v1-abcdef123456789';
      const result = await configCommand.validateApiKey(validKey);
      expect(result).toBe(true);
    });

    it('should reject invalid API key format', async () => {
      const invalidKey = 'invalid-key';
      const result = await configCommand.validateApiKey(invalidKey);
      expect(result).toBe(false);
    });

    it('should validate cache TTL range', async () => {
      const validTtl = '168'; // 7 days in hours
      const result = await configCommand.validateCacheTtl(validTtl);
      expect(result).toBe(true);
    });

    it('should reject invalid TTL values', async () => {
      const invalidTtl = '-1';
      const result = await configCommand.validateCacheTtl(invalidTtl);
      expect(result).toBe(false);
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid subcommand', async () => {
      const args = ['invalid'];
      const options = {};
      
      await expect(configCommand.execute(args, options)).rejects.toThrow('Invalid config subcommand');
    });

    it('should require subcommand', async () => {
      const args: string[] = [];
      const options = {};
      
      await expect(configCommand.execute(args, options)).rejects.toThrow('Config subcommand required');
    });

    it('should require key for set operation', async () => {
      const args = ['set'];
      const options = {};
      
      await expect(configCommand.execute(args, options)).rejects.toThrow('Key and value required for set operation');
    });

    it('should require key for get operation', async () => {
      const args = ['get'];
      const options = {};
      
      await expect(configCommand.execute(args, options)).rejects.toThrow('Key required for get operation');
    });
  });
});