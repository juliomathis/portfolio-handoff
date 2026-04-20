import { describe, expect, it } from 'vitest';
import { bodyCards, bodyHeader } from '../../src/content/body-section';
import { heroColumns, heroTitle } from '../../src/content/hero';
import { navBrand, navLinks, siteMeta } from '../../src/content/site';

describe('site content data', () => {
  it('keeps required site metadata fields populated', () => {
    expect(siteMeta).toMatchObject({
      title: expect.any(String),
      description: expect.any(String),
      topLeft: expect.any(String),
      topRight: expect.any(String),
    });

    expect(siteMeta.title.length).toBeGreaterThan(10);
    expect(siteMeta.description.length).toBeGreaterThan(30);
    expect(siteMeta.topLeft).toContain('portfolio_2026');
    expect(siteMeta.topRight).toContain('robot');
  });

  it('keeps navigation links valid, ordered, and unique', () => {
    expect(navBrand).toBe('robot.dev');

    expect(navLinks).toHaveLength(5);
    expect(navLinks.map((link) => link.href)).toEqual(['#body', '#brain', '#rooms', '#all', '#contact']);

    const hrefs = navLinks.map((link) => link.href);
    const labels = navLinks.map((link) => link.label);
    const sections = navLinks.map((link) => link.section);

    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(new Set(labels).size).toBe(labels.length);
    expect(new Set(sections).size).toBe(sections.length);

    for (const link of navLinks) {
      expect(link.label).toMatch(/^\/\s.+/);
      expect(link.href).toMatch(/^#[a-z]+$/);
      expect(['body', 'brain', 'rooms', 'projects', 'contact']).toContain(link.section);
    }
  });
});

describe('hero content data', () => {
  it('keeps a triptych-oriented hero title', () => {
    const lowerTitle = heroTitle.toLowerCase();

    expect(heroTitle.length).toBeGreaterThan(40);
    expect(lowerTitle).toContain('body');
    expect(lowerTitle).toContain('brain');
    expect(lowerTitle).toContain('rooms');
  });

  it('keeps three ordered columns with constrained motif settings', () => {
    expect(heroColumns).toHaveLength(3);
    expect(heroColumns.map((column) => column.motifVariant)).toEqual(['body', 'brain', 'rooms']);

    const emphases = heroColumns.map((column) => column.emphasis);
    expect(new Set(emphases).size).toBe(emphases.length);

    for (const [index, column] of heroColumns.entries()) {
      expect(column.num).toMatch(/^\/ 0[1-3] - [A-Z]+$/);
      expect(column.phrase.length).toBeGreaterThan(8);
      expect(column.caption.length).toBeGreaterThan(20);
      expect(column.phrase.toLowerCase()).toContain(column.emphasis.toLowerCase());
      expect(column.num).toContain(`0${index + 1}`);

      if (column.motifVariant === 'brain') {
        expect(column.motifStroke).toMatch(/^#[0-9A-F]{6}$/i);
        expect(column.motifFill).toMatch(/^#[0-9A-F]{6}$/i);
      } else {
        expect(column.motifStroke).toBeUndefined();
        expect(column.motifFill).toBeUndefined();
      }
    }
  });
});

describe('body section content data', () => {
  it('keeps body header structure and body section identity', () => {
    expect(bodyHeader).toMatchObject({
      section: 'body',
      num: expect.any(String),
      title: expect.any(String),
      subtitle: expect.any(String),
    });

    expect(bodyHeader.num).toMatch(/^\/ 01 - BODY$/);
    expect(bodyHeader.title.toLowerCase()).toContain('body');
    expect(bodyHeader.subtitle).toContain('HARDWARE TRACK');
  });

  it('keeps four distinct CAD cards with valid labels and constrained sizes', () => {
    expect(bodyCards).toHaveLength(4);
    expect(bodyCards[0]?.size).toBe('lg');

    const titles = bodyCards.map((card) => card.title);
    const imageLabels = bodyCards.map((card) => card.imageLabel);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(imageLabels).size).toBe(imageLabels.length);

    for (const card of bodyCards) {
      expect(card.title.length).toBeGreaterThan(4);
      expect(card.description.length).toBeGreaterThan(30);
      expect(card.imageLabel).toMatch(/^[a-z0-9_]+\.(jpg|png|cad)$/i);

      if (card.size !== undefined) {
        expect(['sm', 'md', 'lg']).toContain(card.size);
      }
    }
  });
});
