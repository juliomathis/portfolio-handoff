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
      canonicalUrl: expect.any(String),
    });

    expect(siteMeta.title.length).toBeGreaterThan(10);
    expect(siteMeta.description.length).toBeGreaterThan(30);
    expect(siteMeta.topLeft).toContain('portfolio_2026');
    expect(siteMeta.topLeft).toContain('◉');
    expect(siteMeta.topRight).toContain('robot');
    expect(siteMeta.topRight).toContain('·');
    expect(siteMeta.canonicalUrl).toMatch(/^https?:\/\//);
  });

  it('keeps navigation links valid, ordered, and accent-scoped', () => {
    expect(navBrand).toMatchObject({
      name: 'robot',
      suffix: '.dev',
    });

    expect(navLinks).toHaveLength(5);
    expect(navLinks.map((link) => link.href)).toEqual(['#body', '#brain', '#rooms', '#all', '#contact']);

    const hrefs = navLinks.map((link) => link.href);
    const labels = navLinks.map((link) => link.label);
    const accents = navLinks.map((link) => (link as { accent?: string }).accent ?? null);

    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(new Set(labels).size).toBe(labels.length);
    expect(accents).toEqual(['body', 'brain', 'rooms', null, null]);

    for (const link of navLinks) {
      expect(link.label).toMatch(/^\/\s.+/);
      expect(link.href).toMatch(/^#[a-z]+$/);
    }
  });
});

describe('hero content data', () => {
  it('keeps a structured triptych-oriented hero title payload', () => {
    expect(heroTitle).toMatchObject({
      lead: expect.any(String),
      body: 'body',
      midA: expect.any(String),
      brain: 'brain',
      midB: expect.any(String),
      rooms: 'rooms',
      tail: expect.any(String),
    });
  });

  it('keeps three ordered columns with explicit phrase splits and motif settings', () => {
    expect(heroColumns).toHaveLength(3);
    expect(heroColumns.map((column) => (column as { key: string }).key)).toEqual(['body', 'brain', 'rooms']);
    expect(heroColumns.map((column) => (column as { number: string }).number)).toEqual([
      '/ 01 - HARDWARE',
      '/ 02 - SOFTWARE',
      '/ 03 - ECOSYSTEM',
    ]);

    const emphases = heroColumns.map((column) => (column as { phraseEmphasis: string }).phraseEmphasis);
    expect(new Set(emphases).size).toBe(emphases.length);

    for (const column of heroColumns) {
      expect((column as { phraseLead: string }).phraseLead).toBe('I');
      expect((column as { phraseTail: string }).phraseTail.length).toBeGreaterThan(8);
      expect(column.caption.length).toBeGreaterThan(20);
      expect((column as { motifVariant: string }).motifVariant).toMatch(/^(body|brain|rooms)$/);

      if ((column as { motifVariant: string }).motifVariant === 'brain') {
        expect((column as { motifStroke?: string }).motifStroke).toMatch(/^#[0-9A-F]{6}$/i);
        expect((column as { motifFill?: string }).motifFill).toMatch(/^#[0-9A-F]{6}$/i);
      } else {
        expect((column as { motifStroke?: string }).motifStroke).toBeUndefined();
        expect((column as { motifFill?: string }).motifFill).toBeUndefined();
      }
    }
  });
});

describe('body section content data', () => {
  it('keeps body header structure and triptych section framing', () => {
    expect(bodyHeader).toMatchObject({
      tag: '/ 01 · BODY',
      headingLead: 'I',
      headingEmphasis: 'design',
      headingTail: 'the body.',
      countTitle: 'HARDWARE TRACK',
      countMeta: 'CAD · PCB · FAB · METAL',
    });
  });

  it('keeps four distinct CAD cards with blueprint headers and domain tags', () => {
    expect(bodyCards).toHaveLength(4);
    expect(bodyCards[0]).toMatchObject({
      headerLeft: 'DWG-001 · BIPED-V3',
      headerRight: 'SCALE 1:4',
      title: 'bipedal',
      titleEmphasis: 'walker v3',
      imageLabel: 'biped_hero.jpg',
      tags: ['hw', 'sw'],
      large: true,
    });
    expect(bodyCards[1]).toMatchObject({
      headerLeft: 'DWG-002 · GRIPPER',
      headerRight: 'REV B',
      tags: ['hw'],
    });
    expect(bodyCards[3]).toMatchObject({
      headerRight: 'TORQUE 8Nm',
      title: 'torque',
      titleEmphasis: 'actuator',
    });

    const titles = bodyCards.map((card) => card.title);
    const imageLabels = bodyCards.map((card) => card.imageLabel);

    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(imageLabels).size).toBe(imageLabels.length);

    for (const card of bodyCards) {
      expect(card.title.length).toBeGreaterThanOrEqual(4);
      expect(card.description.length).toBeGreaterThan(30);
      expect(card.imageLabel).toMatch(/^[a-z0-9_]+\.(jpg|png|cad)$/i);
      expect((card as { headerLeft: string }).headerLeft).toContain('DWG-');
      expect((card as { headerRight: string }).headerRight.length).toBeGreaterThan(3);
      expect((card as { tags: string[] }).tags.length).toBeGreaterThan(0);
      expect((card as { tags: string[] }).tags.every((tag) => ['hw', 'sw', 'eco'].includes(tag))).toBe(true);
    }
  });
});

describe('brain section content data', () => {
  it('keeps brain header anchored to software track with split heading payload', () => {
    expect(brainHeader).toMatchObject({
      tag: '/ 02 · BRAIN',
      headingLead: 'I',
      headingEmphasis: 'train',
      headingTail: 'the brain.',
      countTitle: 'SOFTWARE TRACK',
      countMeta: 'RL · CV · SLAM · SIM',
    });
  });

  it('keeps five node cards with telemetry headers and optional ornaments', () => {
    expect(brainNodes).toHaveLength(5);
    expect(brainNodes.filter((node) => node.width === 'w6')).toHaveLength(2);
    expect(brainNodes.filter((node) => node.width === 'w4')).toHaveLength(3);

    expect(brainNodes[0]).toMatchObject({
      headerLeft: 'policy.pt · PPO',
      headerRight: 'loss ↓ 0.043',
      title: 'sim-to-real',
      titleEmphasis: 'walker policy',
      includeLossCurve: true,
    });
    expect(brainNodes[1]).toMatchObject({
      headerLeft: 'perception.py',
      headerRight: '12Hz · 94%',
      title: 'visual-grasp',
      titleEmphasis: 'ranker',
    });
    expect((brainNodes[1] as { codeLines?: string[] }).codeLines).toEqual([
      '# grasp_ranker.py',
      'class GraspRanker(nn.Module):',
      '  def forward(self, rgb, depth):',
      '    return self.head(self.backbone(rgb))',
    ]);

    const titles = brainNodes.map((node) => node.title);
    expect(new Set(titles).size).toBe(titles.length);

    for (const node of brainNodes) {
      expect(node.description.length).toBeGreaterThan(30);
      expect(node.tags.length).toBeGreaterThan(0);
      expect(node.tags.every((tag) => ['hw', 'sw', 'eco'].includes(tag))).toBe(true);
      expect((node as { headerLeft: string }).headerLeft.length).toBeGreaterThan(6);
      expect((node as { headerRight: string }).headerRight.length).toBeGreaterThan(3);
      expect((node as { titleEmphasis: string }).titleEmphasis.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('rooms section content data', () => {
  it('keeps rooms header and summary focused on ecosystem building', () => {
    expect(roomsHeader).toMatchObject({
      tag: '/ 03 · ROOMS',
      headingLead: 'I',
      headingEmphasis: 'open',
      headingTail: 'the rooms.',
      countTitle: 'ECOSYSTEM TRACK',
      countMeta: 'EVENTS · SUMMITS · HACKS',
    });

    expect(roomsSummary).toMatchObject({
      kicker: 'Why rooms -',
      titleLine1: 'good work',
      titleLine2: 'happens where',
      emphasis: 'builders meet.',
      totalBuilders: '410+',
      launchedProjects: '17',
    });
  });

  it('keeps three poster cards with ticket stubs, variants, and ecosystem tags', () => {
    expect(roomPosters).toHaveLength(3);
    expect(roomPosters[0]).toMatchObject({
      large: true,
      stubLeft: 'EST. 2024',
      stubRight: 'N° 01',
      kicker: 'The flagship -',
      title: 'the Robotics',
      titleEmphasis: 'Builders Summit',
      statValue: '240',
      statLabel: '// attendees · edition III (projected)',
      tags: ['eco'],
    });
    expect(roomPosters[1]).toMatchObject({
      variant: 'accent',
      stubLeft: 'WEEKEND FORMAT',
      stubRight: '24 HR',
      kicker: 'Hack -',
      title: 'robo',
      titleEmphasis: 'hack /24',
    });
    expect(roomPosters[2]).toMatchObject({
      variant: 'dark',
      stubLeft: 'INVITE-ONLY',
      stubRight: 'QUARTERLY',
      kicker: 'Small rooms -',
      title: 'the',
      titleEmphasis: 'workshop series',
    });

    const titles = roomPosters.map((poster) => poster.title);

    expect(new Set(titles).size).toBe(titles.length);

    for (const poster of roomPosters) {
      expect((poster as { stubLeft: string }).stubLeft.length).toBeGreaterThan(3);
      expect((poster as { stubRight: string }).stubRight.length).toBeGreaterThan(1);
      expect((poster as { kicker: string }).kicker.length).toBeGreaterThan(4);
      expect((poster as { titleEmphasis: string }).titleEmphasis.length).toBeGreaterThan(3);
      expect(poster.description.length).toBeGreaterThan(30);
      expect((poster as { tags: string[] }).tags).toEqual(['eco']);
    }
  });
});

describe('projects content data', () => {
  it('keeps projects intro and venn legend aligned with three-domain framing', () => {
    expect(projectsIntro.length).toBeGreaterThan(100);
    expect(projectsIntro.toLowerCase()).toContain('territories');

    expect(vennLegend).toEqual([
      { key: 'HW', text: 'I designed or fabricated hardware.' },
      { key: 'SW', text: 'I wrote the intelligence.' },
      { key: 'ECO', text: 'I built the space / event around it.' },
    ]);
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
    expect(contactHeading).toMatchObject({
      lead: 'build the',
      body: 'body',
      mid: 'train the',
      brain: 'brain',
      tailLead: 'fill the',
      rooms: 'rooms',
    });

    expect(contactLinks).toHaveLength(5);

    const labels = contactLinks.map((link) => link.label);

    expect(new Set(labels).size).toBe(labels.length);
    expect(contactLinks).toEqual([
      { label: 'robot@placeholder.edu ->', href: 'mailto:robot@placeholder.edu' },
      { label: 'github.com/robot ->', href: '#' },
      { label: 'linkedin.com/in/robot ->', href: '#' },
      { label: 'resume_2026.pdf ↓', href: '#' },
      { label: '/ rooms · upcoming events ->', href: '#' },
    ]);
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
