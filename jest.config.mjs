import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};

export default createJestConfig(customJestConfig);