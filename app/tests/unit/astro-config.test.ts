import { describe, expect, it } from 'vitest';
import { resolveSiteUrl } from '../../astro.config.mjs';

describe('astro config site URL', () => {
  it('uses PUBLIC_SITE_URL when provided', () => {
    expect(resolveSiteUrl('https://portfolio.example.com')).toBe('https://portfolio.example.com');
  });

  it('falls back to localhost URL for local development', () => {
    expect(resolveSiteUrl(undefined)).toBe('http://localhost:4321');
  });
});
