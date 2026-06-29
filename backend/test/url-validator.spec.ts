import { normalizeUrl, validateUrl } from '../src/common/url-validator';

describe('validateUrl', () => {
  it('accepts https URL', () => {
    expect(validateUrl('https://example.com')).toBe('https://example.com/');
  });

  it('prepends https when missing scheme', () => {
    expect(validateUrl('example.com')).toBe('https://example.com/');
  });

  it('rejects invalid URL', () => {
    expect(() => validateUrl('not a url')).toThrow('Please enter a valid URL');
  });
});
