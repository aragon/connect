const baseConfig = require('../../jest.config.base')

const packageName = require('./package.json').name.split('@aragon/').pop()

module.exports = {
  ...baseConfig,
  roots: [`<rootDir>/packages/${packageName}`],
  collectCoverageFrom: ['src/**/*.{ts}'],
  testRegex: `(packages/${packageName}/.*/__tests__/.*|\\.(test))\\.ts?$`,
  modulePaths: [`<rootDir>/packages/${packageName}/src/`],
  name: packageName,
  displayName: 'CONNECT',
  rootDir: '../..',
}
