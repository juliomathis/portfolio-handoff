import type { HeroColumn } from '../lib/types';

type HeroColumnWithMotif = HeroColumn & {
  motifStroke?: string;
  motifFill?: string;
};

export const heroTitle =
  'i work across three territories - the body of the machine, the brain that runs it, and the rooms where others come to build theirs.';

export const heroColumns: HeroColumnWithMotif[] = [
  {
    num: '/ 01 - HARDWARE',
    phrase: 'I design the body.',
    emphasis: 'design',
    caption: 'CAD - torque-controlled actuators - PCBs - things I machine on a Friday night.',
    motifVariant: 'body',
  },
  {
    num: '/ 02 - SOFTWARE',
    phrase: 'I train the brain.',
    emphasis: 'train',
    caption: 'RL policies - perception - SLAM - sim-to-real - the parts that do not exist without math.',
    motifVariant: 'brain',
    motifStroke: '#E8ECF5',
    motifFill: '#0F1620',
  },
  {
    num: '/ 03 - ECOSYSTEM',
    phrase: 'I open the rooms.',
    emphasis: 'open',
    caption: 'summits - hackathons - the spaces where builders find each other and start shipping.',
    motifVariant: 'rooms',
  },
];
