import {default as fakeFunc} from './fakefunction';

test('returns true value of the fakefunction', () => {
  expect(fakeFunc()).toBe("I AM A FAKE FUNCTION");
});