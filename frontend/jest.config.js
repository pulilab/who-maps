module.exports = {
  verbose: false,
  bail: true,
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.js'
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
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
