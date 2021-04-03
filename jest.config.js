const baseConfig = require('./jest.config.base')

module.exports = {
  ...baseConfig,
  projects: [
    '<rootDir>/packages/connect/jest.config.js',
    '<rootDir>/packages/connect-core/jest.config.js',
    '<rootDir>/packages/connect-thegraph/jest.config.js',
  ],
  coverageDirectory: '<rootDir>/coverage/',
  testTimeout: 120000,
  collectCoverageFrom: ['<rootDir>/packages/*/src/**/*.{ts,tsx}'],
}
