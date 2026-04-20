import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const currentDir = dirname(fileURLToPath(import.meta.url));

const readSource = async (relativePath: string) => {
  const absolutePath = resolve(currentDir, relativePath);
  return readFile(absolutePath, 'utf8');
};

describe('base layout contract', () => {
  it('defines document shell, metadata props, and required font links', async () => {
    const baseAstro = await readSource('../../src/layouts/Base.astro');

    expect(baseAstro).toContain("import '../styles/global.css';");
    expect(baseAstro).toMatch(
      /interface\s+Props\s*\{[\s\S]*title\?:\s*string;[\s\S]*description\?:\s*string;[\s\S]*canonicalUrl\?:\s*string;[\s\S]*\}/,
    );
    expect(baseAstro).toMatch(/const\s*\{[\s\S]*\}\s*:\s*Props\s*=\s*Astro\.props;/);
    expect(baseAstro).toContain('<!doctype html>');
    expect(baseAstro).toContain('<html lang="en">');
    expect(baseAstro).toMatch(/<meta\s+name="description"\s+content=\{description\}\s*\/>/);
    expect(baseAstro).toMatch(/<link\s+rel="canonical"\s+href=\{canonicalUrl\}\s*\/>/);
    expect(baseAstro).toMatch(/<meta\s+property="og:type"\s+content="website"\s*\/>/);
    expect(baseAstro).toMatch(/<meta\s+property="og:title"\s+content=\{title\}\s*\/>/);
    expect(baseAstro).toMatch(/<meta\s+property="og:description"\s+content=\{description\}\s*\/>/);
    expect(baseAstro).toMatch(/<meta\s+property="og:url"\s+content=\{canonicalUrl\}\s*\/>/);
    expect(baseAstro).toMatch(/<a\s+class="skip-link"\s+href="#main">[\s\S]*<\/a>/);
    expect(baseAstro).toContain('family=Space+Grotesk');
    expect(baseAstro).toContain('family=JetBrains+Mono');
    expect(baseAstro).toContain('family=Fraunces');
  });
});

describe('phase 1 index shell contract', () => {
  it('wires metadata through Base and exposes required section structure', async () => {
    const indexAstro = await readSource('../../src/pages/index.astro');

    expect(indexAstro).toMatch(/import\s+Base\s+from\s+'\.\.\/layouts\/Base\.astro';/);
    expect(indexAstro).toMatch(/import\s+\{\s*siteMeta\s*\}\s+from\s+'\.\.\/content';/);
    expect(indexAstro).toMatch(
      /<Base[^>]*title=\{siteMeta\.title\}[^>]*description=\{siteMeta\.description\}[^>]*canonicalUrl=\{siteMeta\.canonicalUrl\}[^>]*>/,
    );
    expect(indexAstro).toMatch(/<main\s+id="main">/);

    for (const id of ['body', 'brain', 'rooms', 'all', 'contact']) {
      const sectionPattern = new RegExp(`<section\\s+id="${id}"[\\s\\S]*?>`, 'm');
      expect(indexAstro).toMatch(sectionPattern);
    }
  });
});
