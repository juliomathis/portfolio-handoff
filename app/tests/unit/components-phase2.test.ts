import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const appDir = process.cwd();
const srcDir = resolve(appDir, 'src');
const componentsDir = resolve(srcDir, 'components');

const collectAstroFiles = (directory: string): string[] => {
  const entries = readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return collectAstroFiles(fullPath);
    }

    if (!fullPath.endsWith('.astro')) {
      return [];
    }

    return [fullPath];
  });
};

describe('phase 2 component structure', () => {
  it('keeps required component and island files in place', () => {
    const requiredPaths = [
      'src/components/MotifJoint.astro',
      'src/components/Nav.astro',
      'src/components/Hero.astro',
      'src/components/MorphBar.astro',
      'src/components/CadCard.astro',
      'src/components/BodySection.astro',
      'src/components/NodeCard.astro',
      'src/components/BrainSection.astro',
      'src/components/Poster.astro',
      'src/components/RoomsSection.astro',
      'src/components/AllProjectsSection.astro',
      'src/components/Contact.astro',
      'src/components/Footer.astro',
      'src/islands/ProjectFilter.tsx',
    ];

    for (const relativePath of requiredPaths) {
      expect(existsSync(resolve(appDir, relativePath))).toBe(true);
    }
  });

  it('mounts ProjectFilter as the single hydrated island', () => {
    const allProjectsSource = readFileSync(resolve(componentsDir, 'AllProjectsSection.astro'), 'utf8');

    expect(allProjectsSource).toMatch(
      /<ProjectFilter\s+client:visible\s+projects=\{projects\}\s*\/>/,
    );

    const astroSources = collectAstroFiles(srcDir).map((filePath) => readFileSync(filePath, 'utf8'));
    const clientDirectives = astroSources.flatMap((source) => source.match(/client:[a-z]+/g) ?? []);

    expect(clientDirectives).toEqual(['client:visible']);
  });

  it('uses native details/summary for the mobile menu', () => {
    const navSource = readFileSync(resolve(componentsDir, 'Nav.astro'), 'utf8');

    expect(navSource).toContain('<details');
    expect(navSource).toContain('<summary');
  });

  it('keeps phase-3 testing files and scripts in place', () => {
    const requiredPaths = [
      'playwright.config.ts',
      'tests/e2e/smoke.spec.ts',
      'tests/e2e/responsive.spec.ts',
      'tests/e2e/filter.spec.ts',
      'tests/e2e/a11y.spec.ts',
      'lighthouserc.json',
    ];

    for (const relativePath of requiredPaths) {
      expect(existsSync(resolve(appDir, relativePath))).toBe(true);
    }

    const packageJson = JSON.parse(readFileSync(resolve(appDir, 'package.json'), 'utf8')) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.['test:e2e']).toBe('playwright test');
    expect(packageJson.scripts?.['test:e2e:update']).toBe('playwright test --update-snapshots');
    expect(packageJson.scripts?.['test:e2e:install']).toBe('playwright install chromium');
    expect(packageJson.scripts?.lhci).toBe('lhci autorun');
  });
});
