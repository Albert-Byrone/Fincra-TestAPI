module.exports = {
  testEnvironment: 'node', // Use the Node test environment
  globalSetup: './__tests__/setup.js',
  globalTeardown: './__tests__/teardown.js',
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverage: true,
  coverageReporters: ['html'],



};