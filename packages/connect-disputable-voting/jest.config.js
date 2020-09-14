const baseConfig = require('../../jest.config.base')

const packageName = require('./package.json').name.split('@aragon/').pop()

module.exports = {
  ...baseConfig,
  roots: [`<rootDir>/packages/${packageName}`],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testRegex: `(packages/${packageName}/.*/__tests__/.*|\\.(test|spec))\\.tsx?$`,
  modulePaths: [`<rootDir>/packages/${packageName}/src/`],
  name: packageName,
  displayName: 'DISPUTABLE-VOTING',
  rootDir: '../..',
  testTimeout: 20000
}
