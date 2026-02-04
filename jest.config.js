module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '@models/(.*)': '<rootDir>/src/models/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@routes/(.*)': '<rootDir>/src/routes/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
  },
};
