import { AnalyzeCommand } from '../../src/cli/AnalyzeCommand';

describe('AnalyzeCommand Contract', () => {
  let analyzeCommand: AnalyzeCommand;

  beforeEach(() => {
    analyzeCommand = new AnalyzeCommand();
  });

  describe('CLI Interface', () => {
    it('should accept package names as arguments', async () => {
      const args = ['express', 'lodash'];
      const options = {};
      
      expect(() => analyzeCommand.execute(args, options)).not.toThrow();
    });

    it('should support --version option', async () => {
      const args = ['express'];
      const options = { version: '4.18.2' };
      
      expect(() => analyzeCommand.execute(args, options)).not.toThrow();
    });

    it('should support --format option with json/text/html', async () => {
      const args = ['express'];
      const options = { format: 'json' };
      
      expect(() => analyzeCommand.execute(args, options)).not.toThrow();
    });

    it('should support --output option', async () => {
      const args = ['express'];
      const options = { output: './report.json' };
      
      expect(() => analyzeCommand.execute(args, options)).not.toThrow();
    });

    it('should support --depth option with range 1-15', async () => {
      const args = ['express'];
      const options = { depth: 10 };
      
      expect(() => analyzeCommand.execute(args, options)).not.toThrow();
    });

    it('should support --cache option', async () => {
      const args = ['express'];
      const options = { cache: false };
      
      expect(() => analyzeCommand.execute(args, options)).not.toThrow();
    });

    it('should support --severity option', async () => {
      const args = ['express'];
      const options = { severity: 'high' };
      
      expect(() => analyzeCommand.execute(args, options)).not.toThrow();
    });

    it('should support --timeout option', async () => {
      const args = ['express'];
      const options = { timeout: 60 };
      
      expect(() => analyzeCommand.execute(args, options)).not.toThrow();
    });

    it('should return exit code 0 for no security issues', async () => {
      const args = ['safe-package'];
      const options = {};
      
      const result = await analyzeCommand.execute(args, options);
      expect(result).toBe(0);
    });

    it('should return exit code 1 for security issues found', async () => {
      const args = ['vulnerable-package'];
      const options = {};
      
      const result = await analyzeCommand.execute(args, options);
      expect(result).toBe(1);
    });
  });

  describe('Input Validation', () => {
    it('should reject empty package names', async () => {
      const args: string[] = [];
      const options = {};
      
      const exitCode = await analyzeCommand.execute(args, options);
      expect(exitCode).toBe(1); // Error exit code
    });

    it('should reject invalid format option', async () => {
      const args = ['express'];
      const options = { format: 'invalid' };
      
      const exitCode = await analyzeCommand.execute(args, options);
      expect(exitCode).toBe(1); // Error exit code
    });

    it('should reject depth out of range', async () => {
      const args = ['express'];
      const options = { depth: 20 };
      
      const exitCode = await analyzeCommand.execute(args, options);
      expect(exitCode).toBe(1); // Error exit code
    });
  });
});