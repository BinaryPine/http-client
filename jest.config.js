module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  collectCoverageFrom: ['lib/**/*.js'],
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
    },
  },
};
