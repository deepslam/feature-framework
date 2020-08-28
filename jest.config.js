module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  modulePaths: [
    '<rootDir>',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: { '\\.ts$': ['ts-jest'] },
  resetMocks: true,
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['./jestSetup.js'],
};
