import test from "./test.js";

export default async function (options) {
  let jsspec = `import {hello} from './index';

describe('hello', () => {
  it('hello("World") to return "Hello World!"', function () {
    expect(hello('World')).toEqual('Hello, World!');
  });
});`;

  let jstest = `/* eslint-disable max-lines-per-function */

import { writeHello } from '../src';

describe('writeHello', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Spy on console.log and provide a mock implementation
  });

  afterEach(() => {
    // Clear mock call history after each test
    console.log.mockClear();
  });

  afterAll(() => {
    // Restore console.log to its original implementation after all tests
    console.log.mockRestore();
  });

  it('writeHello("World") to return "Hello, World!"', () => {
    writeHello('World');
    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Hello, World!');
  });
});
`;
  test(options, jstest, jsspec);
}
