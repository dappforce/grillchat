import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.ts?(x)$',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testEnvironment: 'jsdom',
}

export default config
