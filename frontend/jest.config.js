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
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
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
