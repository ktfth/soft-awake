// Mock fs for file system operations
const fs = jest.createMockFromModule('fs');

// Mock package.json content
const mockPackageJson = {
  name: 'test-package',
  version: '1.0.0',
  dependencies: {
    'express': '^4.18.0',
    'lodash': '^4.17.21'
  },
  devDependencies: {
    'jest': '^29.0.0',
    'typescript': '^5.0.0'
  }
};

// Override specific functions
fs.existsSync = jest.fn((path) => {
  // Return true for default package.json location to prevent "file not found" errors
  if (path === './package.json' || path.endsWith('package.json') && !path.includes('non-existent')) {
    return true;
  }
  // Return false for test cases that explicitly test non-existent files
  if (path.includes('non-existent') || path.includes('missing')) {
    return false;
  }
  return false;
});

fs.readFileSync = jest.fn((path, encoding) => {
  if (path.includes('package.json')) {
    // Return invalid JSON for test cases that test invalid format
    if (path.includes('invalid') || path.includes('malformed')) {
      return '{ invalid json }';
    }
    return JSON.stringify(mockPackageJson);
  }
  return '{}';
});

fs.writeFileSync = jest.fn();
fs.mkdirSync = jest.fn();

module.exports = fs;