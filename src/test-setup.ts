// Jest setup file for test configuration
import { jest } from '@jest/globals';

// Global test setup
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Console suppression for cleaner test output
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};