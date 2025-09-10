// Global test setup
import 'jest';

// Mock environment variables
process.env.OPENROUTER_API_KEY = 'mock-api-key';
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock process.exit to prevent tests from exiting
const originalExit = process.exit;
process.exit = jest.fn() as any;

// Mock fs operations globally
jest.mock('fs', () => require('../tests/__mocks__/fs'));
jest.mock('axios', () => require('../tests/__mocks__/axios'));

// Setup global test timeout
jest.setTimeout(10000);