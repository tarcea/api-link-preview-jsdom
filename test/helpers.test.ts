import jest from 'jest';
import { isValidUrl, getDomain } from '../src/middlewares';

describe('test helper functions', () => {
  describe('isValidUrl', () => {
    test('should return true or false', () => {
      const result = isValidUrl('aaa');
      expect(typeof result).toBe('boolean');
    });
    test('should return false for an invalid url', () => {
      const result = isValidUrl('aaa');
      expect(result).toBe(false);
    });
    test('should return false for an invalid url', () => {
      const result = isValidUrl('www.google.com');
      expect(result).toBe(false);
    });
    test('should return false for an invalid url', () => {
      const result = isValidUrl('htt://www.test.com');
      expect(result).toBe(false);
    });
    test('should return false for an invalid url', () => {
      const result = isValidUrl('http://www.test.');
      expect(result).toBe(false);
    });
  });
  describe('getDomain', () => {
    test('should just the domain from a given url', () => {
      const result = getDomain('http://www.test.com');
      expect(result).toBe('www.test.com');
    });
  });
});
