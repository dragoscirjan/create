import {logger} from '../src';
import {Logger} from 'winston';

describe('logger', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleSpy: any;

  beforeAll(() => {
    // Spy on console.log and provide a mock implementation
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clear mock call history after each test
    consoleSpy.mockClear();
  });

  afterAll(() => {
    // Restore console.log to its original implementation after all tests
    consoleSpy.mockRestore();
  });

  it('logger to be an defined', () => {
    expect(logger).toBeDefined();
    expect(logger).toBeInstanceOf(Logger);
  });

  // it('logger to call console.log', () => {
  //   logger.info('hello');
  //   expect(console.log).toHaveBeenCalled();
  //   expect(console.log).toHaveBeenCalledWith('hello');
  // });
});
