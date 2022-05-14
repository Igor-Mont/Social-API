import jestConfig from './jest.config'

export default {
  ...jestConfig,
  testMatch: ['**/*.test.ts'],
  testEnvironment: './prisma/prisma-test-environment.ts'
}
