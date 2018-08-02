module.exports = {
  verbose: true,
  bail: true,
  collectCoverage: false,
  restoreMocks: true,
  collectCoverageFrom: [
    '**/store/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/$1'
  }
};
