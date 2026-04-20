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
    expect(baseAstro).toContain('title?: string');
    expect(baseAstro).toContain('description?: string');
    expect(baseAstro).toContain('<!doctype html>');
    expect(baseAstro).toContain('<html lang="en">');
    expect(baseAstro).toContain('<meta name="description" content={description} />');
    expect(baseAstro).toContain('<a class="skip-link" href="#main">Skip to content</a>');

    expect(baseAstro).toContain('family=Space+Grotesk');
    expect(baseAstro).toContain('family=JetBrains+Mono');
    expect(baseAstro).toContain('family=Fraunces');
  });
});

describe('phase 1 index shell contract', () => {
  it('uses Base layout and includes all required section anchors', async () => {
    const indexAstro = await readSource('../../src/pages/index.astro');

    expect(indexAstro).toContain("import Base from '../layouts/Base.astro';");
    expect(indexAstro).toContain("import { siteMeta } from '../content';");
    expect(indexAstro).toContain('<Base title={siteMeta.title} description={siteMeta.description}>');
    expect(indexAstro).toContain('Phase 1 scaffold');
    expect(indexAstro).toContain('<main id="main">');

    for (const id of ['body', 'brain', 'rooms', 'all', 'contact']) {
      expect(indexAstro).toContain(`<section id="${id}">`);
    }
  });
});
