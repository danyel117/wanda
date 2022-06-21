/* eslint-disable import/no-import-module-exports */
import nextJest from 'next/jest';

// eslint-disable-next-line no-restricted-imports
import tsconfig from './tsconfig.json';

/**
 * Create Jest module paths from tsconfig paths
 */
const modulePaths = Object.entries(tsconfig.compilerOptions.paths).reduce(
  (prev, [alias, path]) => ({
    ...prev,
    [`^${alias.replace('*', '(.*)$')}`]: `<rootDir>/${path[0].replace(
      '*',
      '$1'
    )}`,
  }),
  {}
);

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const customJestConfig = {
  moduleNameMapper: {
    ...modulePaths,
  },
  // setupFilesAfterEnv: ['<rootDir>/utils/testing/prisma-mock.ts'],
  collectCoverageFrom: ['./**/*.ts', '!jest.config.ts', '!setupTests.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['node_modules/nanoid'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
