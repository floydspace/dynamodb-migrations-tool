module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: './tests/.+\\.test\\.ts$',
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageReporters: ['text-summary', 'lcov'],
};
