import test from "./test.js";

export default async function (options) {
  let jsspec = `import {hello} from '../src';

describe('hello', () => {
  it('hello("World") to return "Hello World!"', function () {
    expect(hello('World')).toEqual('Hello, World!');
  });
});`;

  let jstest = `import { writeHello } from '../src';

describe('writeHello', () => {
  let logSpy;
  before(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });
  after(() => {
    logSpy.mockRestore();
  })
  it('writeHello("World") to return "writeHello World!"', function() {
    expect(writeHello('World')).toHaveBeenCalled();
    expect(writeHello('World')).toHaveBeenCalledWith('Hello, World!');
  });
});
`;
  test(options, jstest, jsspec);
}
