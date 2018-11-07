module.exports = {
  verbose: true,
  bail: true,
  collectCoverage: true,
  restoreMocks: true,
  collectCoverageFrom: [
    '**/store/**/*.js',
    '**/utilities/**/*.js',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    './utilities/api.js/': {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25
    }
  },
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/$1'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/cypress/'
  ]
};
