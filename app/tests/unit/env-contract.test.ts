import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const appDir = process.cwd();

describe('astro env typing contract', () => {
  it('keeps src/env.d.ts with Astro client reference', () => {
    const envPath = resolve(appDir, 'src/env.d.ts');

    expect(existsSync(envPath)).toBe(true);
    expect(readFileSync(envPath, 'utf8')).toContain('/// <reference types="astro/client" />');
  });
});
