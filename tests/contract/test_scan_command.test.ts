import { ScanCommand } from '../../src/cli/ScanCommand';

describe('ScanCommand Contract', () => {
  let scanCommand: ScanCommand;

  beforeEach(() => {
    scanCommand = new ScanCommand();
  });

  describe('CLI Interface', () => {
    it('should accept package.json path as argument', async () => {
      const args = ['./package.json'];
      const options = {};
      
      expect(() => scanCommand.execute(args, options)).not.toThrow();
    });

    it('should use default ./package.json when no path provided', async () => {
      const args: string[] = [];
      const options = {};
      
      expect(() => scanCommand.execute(args, options)).not.toThrow();
    });

    it('should support --file option', async () => {
      const args: string[] = [];
      const options = { file: './backend/package.json' };
      
      expect(() => scanCommand.execute(args, options)).not.toThrow();
    });

    it('should support --include-dev option', async () => {
      const args: string[] = [];
      const options = { includeDev: true };
      
      expect(() => scanCommand.execute(args, options)).not.toThrow();
    });

    it('should support --exclude option with patterns', async () => {
      const args: string[] = [];
      const options = { exclude: ['@types/*', 'eslint-*'] };
      
      expect(() => scanCommand.execute(args, options)).not.toThrow();
    });

    it('should support --format option', async () => {
      const args: string[] = [];
      const options = { format: 'json' };
      
      expect(() => scanCommand.execute(args, options)).not.toThrow();
    });

    it('should support --output option', async () => {
      const args: string[] = [];
      const options = { output: './scan-report.html' };
      
      expect(() => scanCommand.execute(args, options)).not.toThrow();
    });
  });

  describe('Package.json Processing', () => {
    it('should parse dependencies from package.json', async () => {
      const mockPackageJson = {
        dependencies: { express: '^4.18.2', lodash: '^4.17.21' },
        devDependencies: { jest: '^30.0.0' }
      };
      
      const result = await scanCommand.parsePackageJson(mockPackageJson, { includeDev: false });
      expect(result).toHaveLength(2);
      expect(result).toContain('express');
      expect(result).toContain('lodash');
    });

    it('should include devDependencies when --include-dev is set', async () => {
      const mockPackageJson = {
        dependencies: { express: '^4.18.2' },
        devDependencies: { jest: '^30.0.0' }
      };
      
      const result = await scanCommand.parsePackageJson(mockPackageJson, { includeDev: true });
      expect(result).toHaveLength(2);
      expect(result).toContain('express');
      expect(result).toContain('jest');
    });

    it('should exclude packages matching patterns', async () => {
      const mockPackageJson = {
        dependencies: { 
          express: '^4.18.2',
          '@types/node': '^20.0.0',
          'eslint-config-prettier': '^9.0.0'
        }
      };
      
      const result = await scanCommand.parsePackageJson(mockPackageJson, { 
        exclude: ['@types/*', 'eslint-*']
      });
      expect(result).toHaveLength(1);
      expect(result).toContain('express');
    });
  });

  describe('Input Validation', () => {
    it('should reject non-existent package.json file', async () => {
      const args = ['./non-existent-package.json'];
      const options = {};
      
      await expect(scanCommand.execute(args, options)).rejects.toThrow('Package.json file not found');
    });

    it('should reject invalid package.json format', async () => {
      const args = ['./invalid-package.json'];
      const options = {};
      
      await expect(scanCommand.execute(args, options)).rejects.toThrow('Invalid package.json format');
    });
  });
});