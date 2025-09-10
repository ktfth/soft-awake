// Mock axios for API calls
const mockAxios = {
  get: jest.fn(() => Promise.resolve({
    data: {
      versions: {
        '1.0.0': {
          name: 'mock-package',
          version: '1.0.0',
          description: 'Mock package for testing',
          license: 'MIT',
          dependencies: {},
          devDependencies: {},
          maintainers: [{ name: 'Test User' }]
        }
      },
      'dist-tags': {
        latest: '1.0.0'
      },
      time: {
        '1.0.0': new Date().toISOString()
      }
    }
  })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: {
    timeout: 10000
  }
};

module.exports = mockAxios;