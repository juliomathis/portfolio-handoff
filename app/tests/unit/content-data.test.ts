import { describe, expect, it } from 'vitest';
import { brainHeader, brainNodes } from '../../src/content/brain-section';
import { bodyCards, bodyHeader } from '../../src/content/body-section';
import { contactHeading, contactLinks } from '../../src/content/contact';
import { heroColumns, heroTitle } from '../../src/content/hero';
import {
  allProjects,
  projectsIntro,
  vennLegend,
} from '../../src/content/projects';
import {
  roomPosters,
  roomsHeader,
  roomsSummary,
} from '../../src/content/rooms-section';
import { navBrand, navLinks, siteMeta } from '../../src/content/site';
import * as content from '../../src/content';

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

describe('brain section content data', () => {
  it('keeps brain header anchored to software track', () => {
    expect(brainHeader).toMatchObject({
      section: 'brain',
      num: '/ 02 - BRAIN',
      title: expect.any(String),
      subtitle: expect.any(String),
    });

    expect(brainHeader.title.toLowerCase()).toContain('brain');
    expect(brainHeader.subtitle?.toUpperCase()).toContain('SOFTWARE TRACK');
  });

  it('keeps five node cards with valid widths and domain tags', () => {
    expect(brainNodes).toHaveLength(5);
    expect(brainNodes.filter((node) => node.width === 'w6')).toHaveLength(2);
    expect(brainNodes.filter((node) => node.width === 'w4')).toHaveLength(3);

    const titles = brainNodes.map((node) => node.title);
    expect(new Set(titles).size).toBe(titles.length);

    for (const node of brainNodes) {
      expect(node.description.length).toBeGreaterThan(30);
      expect(node.tags.length).toBeGreaterThan(0);
      expect(node.tags.every((tag) => ['hw', 'sw', 'eco'].includes(tag))).toBe(true);
    }
  });
});

describe('rooms section content data', () => {
  it('keeps rooms header and summary focused on ecosystem building', () => {
    expect(roomsHeader).toMatchObject({
      section: 'rooms',
      num: '/ 03 - ROOMS',
      title: expect.any(String),
      subtitle: expect.any(String),
    });

    expect(roomsHeader.title.toLowerCase()).toContain('rooms');
    expect(roomsHeader.subtitle?.toUpperCase()).toContain('ECOSYSTEM TRACK');

    expect(roomsSummary.title.toLowerCase()).toContain('builders');
    expect(roomsSummary.body.length).toBeGreaterThan(40);
    expect(roomsSummary.tags).toEqual(['eco']);
  });

  it('keeps three poster cards with unique labels', () => {
    expect(roomPosters).toHaveLength(3);
    expect(roomPosters[0]?.size).toBe('lg');

    const titles = roomPosters.map((poster) => poster.title);
    const labels = roomPosters.map((poster) => poster.imageLabel);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(labels).size).toBe(labels.length);

    for (const poster of roomPosters) {
      expect(poster.subtitle.length).toBeGreaterThan(6);
      expect(poster.description.length).toBeGreaterThan(30);
      expect(poster.imageLabel).toMatch(/^[a-z0-9_\-\.]+$/i);
    }
  });
});

describe('projects content data', () => {
  it('keeps projects intro and venn legend aligned with three-domain framing', () => {
    expect(projectsIntro.length).toBeGreaterThan(100);
    expect(projectsIntro.toLowerCase()).toContain('territories');

    expect(vennLegend).toEqual({
      hw: expect.stringContaining('hardware'),
      sw: expect.stringContaining('intelligence'),
      eco: expect.stringContaining('space'),
    });
  });

  it('keeps twelve projects with valid years and domain booleans', () => {
    expect(allProjects).toHaveLength(12);

    const titles = allProjects.map((project) => project.title);
    expect(new Set(titles).size).toBe(titles.length);

    const trinityProjects = allProjects.filter((project) => project.hw && project.sw && project.eco);
    expect(trinityProjects).toHaveLength(1);

    for (const project of allProjects) {
      expect(project.year).toMatch(/^[0-9]{4}(-|—)?$/);
      expect(typeof project.hw).toBe('boolean');
      expect(typeof project.sw).toBe('boolean');
      expect(typeof project.eco).toBe('boolean');
      expect(project.description.length).toBeGreaterThan(15);
    }
  });
});

describe('contact content data', () => {
  it('keeps triptych call-to-action heading and stable contact links', () => {
    const headingLower = contactHeading.toLowerCase();
    expect(headingLower).toContain('body');
    expect(headingLower).toContain('brain');
    expect(headingLower).toContain('rooms');

    expect(contactLinks).toHaveLength(5);

    const labels = contactLinks.map((link) => link.label);
    const hrefs = contactLinks.map((link) => link.href);

    expect(new Set(labels).size).toBe(labels.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(contactLinks.some((link) => link.href.startsWith('mailto:'))).toBe(true);
  });
});

describe('content barrel exports', () => {
  it('re-exports all content modules through src/content/index.ts', () => {
    expect(content.bodyHeader).toBe(bodyHeader);
    expect(content.brainHeader).toBe(brainHeader);
    expect(content.roomsHeader).toBe(roomsHeader);
    expect(content.projectsIntro).toBe(projectsIntro);
    expect(content.contactHeading).toBe(contactHeading);
    expect(content.siteMeta).toBe(siteMeta);
    expect(content.heroTitle).toBe(heroTitle);
  });
});
