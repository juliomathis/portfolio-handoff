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

const DOMAIN_TAGS = ['hw', 'sw', 'eco'] as const;

const isDomainTag = (value: string) => DOMAIN_TAGS.includes(value as (typeof DOMAIN_TAGS)[number]);

describe('site content contracts', () => {
  it('keeps required site metadata and navigation shape', () => {
    expect(siteMeta.title.trim().length).toBeGreaterThan(0);
    expect(siteMeta.description.trim().length).toBeGreaterThan(20);
    expect(siteMeta.topLeft).toContain('portfolio_2026');
    expect(siteMeta.topRight.trim().length).toBeGreaterThan(0);

    expect(navBrand.name.trim().length).toBeGreaterThan(0);
    expect(navBrand.suffix.startsWith('.')).toBe(true);

    expect(navLinks.map((link) => link.href)).toEqual(['#body', '#brain', '#rooms', '#all', '#contact']);

    for (const link of navLinks) {
      expect(link.label.startsWith('/ ')).toBe(true);
      expect(link.href).toMatch(/^#[a-z]+$/);
    }
  });
});

describe('hero content contracts', () => {
  it('keeps triptych title and three ordered columns', () => {
    for (const field of Object.values(heroTitle)) {
      expect(field.trim().length).toBeGreaterThan(0);
    }

    expect(heroTitle.body).toBe('body');
    expect(heroTitle.brain).toBe('brain');
    expect(heroTitle.rooms).toBe('rooms');

    expect(heroColumns).toHaveLength(3);
    expect(heroColumns.map((column) => column.key)).toEqual(['body', 'brain', 'rooms']);

    for (const column of heroColumns) {
      expect(column.number.trim().length).toBeGreaterThan(0);
      expect(column.phraseLead.trim().length).toBeGreaterThan(0);
      expect(column.phraseEmphasis.trim().length).toBeGreaterThan(0);
      expect(column.phraseTail.trim().length).toBeGreaterThan(0);
      expect(column.caption.trim().length).toBeGreaterThan(0);
      expect(column.motifVariant).toBe(column.key);
    }
  });
});

describe('section content contracts', () => {
  it('keeps section header records non-empty', () => {
    for (const header of [bodyHeader, brainHeader, roomsHeader]) {
      expect(header.tag.trim().length).toBeGreaterThan(0);
      expect(header.headingLead.trim().length).toBeGreaterThan(0);
      expect(header.headingEmphasis.trim().length).toBeGreaterThan(0);
      expect(header.headingTail.trim().length).toBeGreaterThan(0);
      expect(header.countTitle.trim().length).toBeGreaterThan(0);
      expect(header.countMeta.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps body cards structurally valid and tag-scoped', () => {
    expect(bodyCards.length).toBeGreaterThan(0);
    expect(bodyCards.some((card) => card.large)).toBe(true);

    for (const card of bodyCards) {
      expect(card.headerLeft.trim().length).toBeGreaterThan(0);
      expect(card.headerRight.trim().length).toBeGreaterThan(0);
      expect(card.imageLabel.trim().length).toBeGreaterThan(0);
      expect(card.title.trim().length).toBeGreaterThan(0);
      expect(card.titleEmphasis.trim().length).toBeGreaterThan(0);
      expect(card.description.trim().length).toBeGreaterThan(20);
      expect(card.tags.length).toBeGreaterThan(0);
      expect(card.tags.every((tag) => isDomainTag(tag))).toBe(true);
    }
  });

  it('keeps brain nodes structurally valid and width-scoped', () => {
    expect(brainNodes.length).toBeGreaterThan(0);

    for (const node of brainNodes) {
      expect(['w4', 'w6', 'w8']).toContain(node.width);
      expect(node.headerLeft.trim().length).toBeGreaterThan(0);
      expect(node.headerRight.trim().length).toBeGreaterThan(0);
      expect(node.title.trim().length).toBeGreaterThan(0);
      expect(node.titleEmphasis.trim().length).toBeGreaterThan(0);
      expect(node.description.trim().length).toBeGreaterThan(20);
      expect(node.tags.length).toBeGreaterThan(0);
      expect(node.tags.every((tag) => isDomainTag(tag))).toBe(true);
      if (node.codeLines) {
        expect(node.codeLines.length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps rooms posters and summary structurally valid', () => {
    expect(roomPosters.length).toBeGreaterThan(0);

    for (const poster of roomPosters) {
      expect(poster.stubLeft.trim().length).toBeGreaterThan(0);
      expect(poster.stubRight.trim().length).toBeGreaterThan(0);
      expect(poster.kicker.trim().length).toBeGreaterThan(0);
      expect(poster.title.trim().length).toBeGreaterThan(0);
      expect(poster.titleEmphasis.trim().length).toBeGreaterThan(0);
      expect(poster.description.trim().length).toBeGreaterThan(20);
      expect(poster.tags.length).toBeGreaterThan(0);
      expect(poster.tags.every((tag) => isDomainTag(tag))).toBe(true);
    }

    expect(roomsSummary.kicker.trim().length).toBeGreaterThan(0);
    expect(roomsSummary.titleLine1.trim().length).toBeGreaterThan(0);
    expect(roomsSummary.titleLine2.trim().length).toBeGreaterThan(0);
    expect(roomsSummary.emphasis.trim().length).toBeGreaterThan(0);
    expect(roomsSummary.totalBuilders.trim().length).toBeGreaterThan(0);
    expect(roomsSummary.launchedProjects.trim().length).toBeGreaterThan(0);
  });
});

describe('projects and contact contracts', () => {
  it('keeps projects intro and venn legend shape', () => {
    expect(projectsIntro.trim().length).toBeGreaterThan(40);
    expect(vennLegend.map((item) => item.key)).toEqual(['HW', 'SW', 'ECO']);

    for (const item of vennLegend) {
      expect(item.text.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps project records valid for filter logic', () => {
    expect(allProjects.length).toBeGreaterThan(0);

    const titles = allProjects.map((project) => project.title);
    expect(new Set(titles).size).toBe(titles.length);

    for (const project of allProjects) {
      expect(project.year).toMatch(/^[0-9]{4}(-|—)?$/);
      expect(typeof project.hw).toBe('boolean');
      expect(typeof project.sw).toBe('boolean');
      expect(typeof project.eco).toBe('boolean');
      expect(project.description.trim().length).toBeGreaterThan(10);
      expect(project.hw || project.sw || project.eco).toBe(true);
    }
  });

  it('keeps contact heading and links valid', () => {
    for (const field of Object.values(contactHeading)) {
      expect(field.trim().length).toBeGreaterThan(0);
    }

    expect(contactLinks.length).toBeGreaterThan(0);
    expect(new Set(contactLinks.map((link) => link.label)).size).toBe(contactLinks.length);

    for (const link of contactLinks) {
      expect(link.label.trim().length).toBeGreaterThan(0);
      expect(link.href).toMatch(/^(mailto:|#|https?:\/\/)/);
    }
  });
});

describe('content barrel exports', () => {
  it('re-exports each phase-1 content module', () => {
    expect(content.siteMeta).toBe(siteMeta);
    expect(content.heroTitle).toBe(heroTitle);
    expect(content.bodyHeader).toBe(bodyHeader);
    expect(content.brainHeader).toBe(brainHeader);
    expect(content.roomsHeader).toBe(roomsHeader);
    expect(content.projectsIntro).toBe(projectsIntro);
    expect(content.contactHeading).toBe(contactHeading);
  });
});
