import { assertPublicUrl } from '../src/common/ssrf-guard';

describe('assertPublicUrl', () => {
  it('blocks localhost', () => {
    expect(() => assertPublicUrl('http://localhost/path')).toThrow(
      'Cannot analyze local or private addresses',
    );
  });

  it('blocks private IP', () => {
    expect(() => assertPublicUrl('http://192.168.1.1/')).toThrow(
      'Cannot analyze local or private addresses',
    );
  });

  it('allows public URL', () => {
    expect(() => assertPublicUrl('https://example.com/')).not.toThrow();
  });
});
