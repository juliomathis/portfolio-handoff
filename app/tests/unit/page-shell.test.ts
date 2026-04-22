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
    expect(baseAstro).toContain('<!doctype html>');
    expect(baseAstro).toContain('<html lang="en">');
    expect(baseAstro).toContain('name="description" content={description}');
    expect(baseAstro).toContain('rel="canonical" href={canonicalUrl}');
    expect(baseAstro).toContain('property="og:type" content="website"');
    expect(baseAstro).toContain('property="og:title" content={title}');
    expect(baseAstro).toContain('property="og:description" content={description}');
    expect(baseAstro).toContain('property="og:url" content={canonicalUrl}');
    expect(baseAstro).toContain('<a class="skip-link" href="#main">Skip to content</a>');
    expect(baseAstro).toContain('family=Space+Grotesk');
    expect(baseAstro).toContain('family=JetBrains+Mono');
    expect(baseAstro).toContain('family=Fraunces');
  });
});

describe('phase 1 index shell contract', () => {
  it('wires metadata through Base and composes phase-2 sections', async () => {
    const indexAstro = await readSource('../../src/pages/index.astro');
    const siteContent = await readSource('../../src/content/site.ts');

    expect(indexAstro).toMatch(/import\s+Base\s+from\s+'\.\.\/layouts\/Base\.astro';/);
    expect(indexAstro).toMatch(/import\s+\{\s*siteMeta\s*\}\s+from\s+'\.\.\/content';/);
    expect(indexAstro).toMatch(/import\s+Nav\s+from\s+'\.\.\/components\/Nav\.astro';/);
    expect(indexAstro).toMatch(/import\s+Hero\s+from\s+'\.\.\/components\/Hero\.astro';/);
    expect(indexAstro).toMatch(/import\s+MorphBar\s+from\s+'\.\.\/components\/MorphBar\.astro';/);
    expect(indexAstro).toMatch(/import\s+BodySection\s+from\s+'\.\.\/components\/BodySection\.astro';/);
    expect(indexAstro).toMatch(/import\s+BrainSection\s+from\s+'\.\.\/components\/BrainSection\.astro';/);
    expect(indexAstro).toMatch(/import\s+RoomsSection\s+from\s+'\.\.\/components\/RoomsSection\.astro';/);
    expect(indexAstro).toMatch(/import\s+AllProjectsSection\s+from\s+'\.\.\/components\/AllProjectsSection\.astro';/);
    expect(indexAstro).toMatch(/import\s+Contact\s+from\s+'\.\.\/components\/Contact\.astro';/);
    expect(indexAstro).toMatch(/import\s+Footer\s+from\s+'\.\.\/components\/Footer\.astro';/);
    expect(indexAstro).toMatch(
      /<Base[^>]*title=\{siteMeta\.title\}[^>]*description=\{siteMeta\.description\}[^>]*>/,
    );
    expect(indexAstro).not.toContain('canonicalUrl={siteMeta.canonicalUrl}');
    expect(siteContent).not.toContain('canonicalUrl:');
    expect(indexAstro).toMatch(/<main\s+id="main">/);
    expect(indexAstro).toContain('<Nav />');
    expect(indexAstro).toContain('<Hero />');
    expect(indexAstro).toContain('<MorphBar from="hero" to="body" fromVariant="body" toVariant="body" />');
    expect(indexAstro).toContain('<BodySection />');
    expect(indexAstro).toContain(
      '<MorphBar from="body (mechanical joint)" to="brain (neural node)" fromVariant="body" toVariant="brain" />',
    );
    expect(indexAstro).toContain('<BrainSection />');
    expect(indexAstro).toContain(
      '<MorphBar from="brain (neural node)" to="rooms (network)" fromVariant="brain" toVariant="rooms"',
    );
    expect(indexAstro).toContain('<RoomsSection />');
    expect(indexAstro).toContain('<MorphBar from="rooms" to="the whole map" fromVariant="rooms" toVariant="body" />');
    expect(indexAstro).toContain('<AllProjectsSection />');
    expect(indexAstro).toContain('<Contact />');
    expect(indexAstro).toContain('<Footer />');
    expect(indexAstro).not.toContain('Phase 1 scaffold');
  });
});
