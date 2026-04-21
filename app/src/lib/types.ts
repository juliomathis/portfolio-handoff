export type SectionKey = 'body' | 'brain' | 'rooms';

export type DomainTag = 'hw' | 'sw' | 'eco';

export type FilterKey = 'all' | DomainTag | 'overlap' | 'trinity';

export type SiteMeta = {
  title: string;
  description: string;
  topLeft: string;
  topRight: string;
};

export type NavBrand = {
  name: string;
  suffix: string;
};

export type NavLink = {
  href: `#${string}`;
  label: string;
  accent?: SectionKey;
};

export type HeroTitle = {
  lead: string;
  body: string;
  midA: string;
  brain: string;
  midB: string;
  rooms: string;
  tail: string;
};

export type HeroColumn = {
  key: SectionKey;
  number: string;
  phraseLead: string;
  phraseEmphasis: string;
  phraseTail: string;
  caption: string;
  motifVariant: SectionKey;
  motifStroke?: string;
  motifFill?: string;
};

export type SectionHeader = {
  tag: string;
  headingLead: string;
  headingEmphasis: string;
  headingTail: string;
  countTitle: string;
  countMeta: string;
};

export type BodyCard = {
  headerLeft: string;
  headerRight: string;
  imageLabel: string;
  title: string;
  titleEmphasis: string;
  description: string;
  tags: DomainTag[];
  large?: boolean;
};

export type BrainNode = {
  width: 'w6' | 'w4' | 'w8';
  headerLeft: string;
  headerRight: string;
  title: string;
  titleEmphasis: string;
  description: string;
  tags: DomainTag[];
  codeLines?: string[];
  includeLossCurve?: boolean;
};

export type PosterCard = {
  variant?: 'default' | 'accent' | 'dark';
  large?: boolean;
  stubLeft: string;
  stubRight: string;
  kicker: string;
  title: string;
  titleEmphasis: string;
  description: string;
  statValue?: string;
  statLabel?: string;
  tags: DomainTag[];
};

export type SummaryPanel = {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  emphasis: string;
  totalBuilders: string;
  launchedProjects: string;
};

export type Project = {
  title: string;
  year: string;
  hw: boolean;
  sw: boolean;
  eco: boolean;
  description: string;
};

export type ContactHeading = {
  lead: string;
  body: string;
  mid: string;
  brain: string;
  tailLead: string;
  rooms: string;
};

export type ContactLink = {
  label: string;
  href: string;
};
