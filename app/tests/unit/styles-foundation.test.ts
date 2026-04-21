import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const stylesDir = resolve(process.cwd(), 'src/styles');
const appDir = process.cwd();

describe('styles foundation files', () => {
  it('keeps phase-1 shared style files in place', () => {
    expect(existsSync(resolve(stylesDir, 'tokens.css'))).toBe(true);
    expect(existsSync(resolve(stylesDir, 'reset.css'))).toBe(true);
    expect(existsSync(resolve(stylesDir, 'typography.css'))).toBe(true);
    expect(existsSync(resolve(stylesDir, 'breakpoints.css'))).toBe(true);
    expect(existsSync(resolve(stylesDir, 'global.css'))).toBe(true);
  });

  it('keeps global.css wired to shared foundations', () => {
    const globalCss = readFileSync(resolve(stylesDir, 'global.css'), 'utf8');
    const importLines = globalCss
      .split('\n')
      .filter((line) => line.startsWith('@import'));

    expect(importLines).toContain("@import './tokens.css';");
    expect(importLines).toContain("@import './reset.css';");
    expect(importLines).toContain("@import './typography.css';");
    expect(importLines).toContain("@import './breakpoints.css';");
    expect(globalCss).toContain('@media (prefers-reduced-motion: reduce)');
    expect(globalCss).toContain('.skip-link');
  });

  it('keeps app entrypoint wired through the shared base layout', () => {
    const indexAstro = readFileSync(resolve(appDir, 'src/pages/index.astro'), 'utf8');
    const baseAstro = readFileSync(resolve(appDir, 'src/layouts/Base.astro'), 'utf8');

    expect(indexAstro).toContain("import Base from '../layouts/Base.astro';");
    expect(baseAstro).toContain("import '../styles/global.css';");
  });

  it('preserves canonical triptych color tokens and breakpoints', () => {
    const tokensCss = readFileSync(resolve(stylesDir, 'tokens.css'), 'utf8');
    const breakpointsCss = readFileSync(resolve(stylesDir, 'breakpoints.css'), 'utf8');
    const postcssConfig = readFileSync(resolve(appDir, 'postcss.config.cjs'), 'utf8');
    const typographyCss = readFileSync(resolve(stylesDir, 'typography.css'), 'utf8');

    expect(tokensCss).toContain('--paper: #F5F1E8;');
    expect(tokensCss).toContain('--body-accent: oklch(0.82 0.11 130);');
    expect(tokensCss).toContain('--brain-bg: #0F1620;');
    expect(tokensCss).toContain('--rooms-accent: oklch(0.74 0.15 50);');
    expect(breakpointsCss).toContain('@custom-media --mobile (max-width: 640px);');
    expect(breakpointsCss).toContain('@custom-media --tablet (min-width: 641px) and (max-width: 1024px);');
    expect(breakpointsCss).toContain('@custom-media --desktop (min-width: 1025px);');
    expect(postcssConfig).toContain('@csstools/postcss-global-data');
    expect(postcssConfig).toContain('src/styles/breakpoints.css');
    expect(postcssConfig).not.toContain('importFrom');
    expect(typographyCss).toContain("'Space Grotesk'");
    expect(typographyCss).toContain('.mono');
  });
});
