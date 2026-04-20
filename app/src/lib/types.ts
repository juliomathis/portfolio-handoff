export type SectionKey = 'hero' | 'body' | 'brain' | 'rooms' | 'projects' | 'contact';

export type DomainTag = 'hw' | 'sw' | 'eco';

export type FilterKey = 'all' | DomainTag | 'overlap' | 'trinity';

export type SiteMeta = {
  title: string;
  description: string;
  canonicalUrl: string;
};

export type SiteDisplayMeta = Omit<SiteMeta, 'canonicalUrl'> & {
  topLeft: string;
  topRight: string;
};

export type NavLink = {
  label: string;
  href: string;
  section: SectionKey;
};

export type Project = {
  title: string;
  year: string;
  hw: boolean;
  sw: boolean;
  eco: boolean;
  description: string;
};

export type HeroColumn = {
  num: string;
  phrase: string;
  emphasis: string;
  caption: string;
  motifVariant: 'body' | 'brain' | 'rooms';
};

export type HeroColumnWithMotif = HeroColumn & {
  motifStroke?: string;
  motifFill?: string;
};

export type SectionHeader = {
  section: SectionKey;
  num: string;
  title: string;
  subtitle?: string;
};

export type BodyCard = {
  title: string;
  description: string;
  imageLabel: string;
  size?: 'sm' | 'md' | 'lg';
};

export type BrainNode = {
  title: string;
  description: string;
  tags: DomainTag[];
  width: 'w4' | 'w6' | 'w12';
};

export type PosterCard = {
  title: string;
  subtitle: string;
  description: string;
  imageLabel: string;
  size?: 'sm' | 'lg';
};

export type SummaryPanel = {
  title: string;
  body: string;
  tags: DomainTag[];
};

export type ContactLink = {
  label: string;
  href: string;
};
