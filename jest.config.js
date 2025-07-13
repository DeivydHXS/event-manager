// jest.config.js
module.exports = {
  bail: true,
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',

  // Adicione estas duas linhas
  detectOpenHandles: true,

  testMatch: ['**/__tests__/**/*.test.js?(x)'],
};
