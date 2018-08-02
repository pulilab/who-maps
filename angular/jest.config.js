module.exports = {
  verbose: true,
  bail: false,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40
    },
    'src/store/': {
      branches: 65,
      functions: 65,
      lines: 65,
      statements: 65
    }
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!redux-async-thunk).+(js|jsx)$'
  ],
  moduleFileExtensions: ['js'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/test/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|html)$': '<rootDir>/test/__mocks__/fileMock.js'
  }
};
