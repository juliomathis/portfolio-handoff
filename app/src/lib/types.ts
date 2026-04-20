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

export type FilterKey = 'all' | 'hw' | 'sw' | 'eco' | 'overlap' | 'trinity';
