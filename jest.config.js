/** @type {import('jest').Config} */
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^axios$': '<rootDir>/tests/__mocks__/axios.js',
    '^fs$': '<rootDir>/tests/__mocks__/fs.js'
  },
  projects: [
    {
      displayName: 'contract',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests/contract'],
      testMatch: ['<rootDir>/tests/contract/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json',
        }],
      },
      moduleFileExtensions: ['ts', 'js', 'json'],
      moduleNameMapper: {
        '^axios$': '<rootDir>/tests/__mocks__/axios.js',
        '^fs$': '<rootDir>/tests/__mocks__/fs.js'
      },
      setupFilesAfterEnv: ['<rootDir>/tests/contract/setup.ts'],
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests/integration'],
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json',
        }],
      },
      moduleFileExtensions: ['ts', 'js', 'json'],
      moduleNameMapper: {
        '^axios$': '<rootDir>/tests/__mocks__/axios.js',
        '^fs$': '<rootDir>/tests/__mocks__/fs.js'
      },
      setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
      testTimeout: 10000,
    },
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests/unit'],
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json',
        }],
      },
      moduleFileExtensions: ['ts', 'js', 'json'],
      moduleNameMapper: {
        '^axios$': '<rootDir>/tests/__mocks__/axios.js',
        '^fs$': '<rootDir>/tests/__mocks__/fs.js'
      },
      setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.ts'],
    },
    {
      displayName: 'performance',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests/performance'],
      testMatch: ['<rootDir>/tests/performance/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json',
        }],
      },
      moduleFileExtensions: ['ts', 'js', 'json'],
      moduleNameMapper: {
        '^axios$': '<rootDir>/tests/__mocks__/axios.js',
        '^fs$': '<rootDir>/tests/__mocks__/fs.js'
      },
      setupFilesAfterEnv: ['<rootDir>/tests/performance/setup.ts'],
      testTimeout: 30000,
    },
    {
      displayName: 'e2e',
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests/e2e'],
      testMatch: ['<rootDir>/tests/e2e/**/*.test.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: 'tsconfig.test.json',
        }],
      },
      moduleFileExtensions: ['ts', 'js', 'json'],
      moduleNameMapper: {
        '^axios$': '<rootDir>/tests/__mocks__/axios.js',
        '^fs$': '<rootDir>/tests/__mocks__/fs.js'
      },
      setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.ts'],
      testTimeout: 60000,
    },
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};