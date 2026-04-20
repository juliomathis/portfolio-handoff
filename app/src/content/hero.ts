import type { HeroColumn, HeroTitle } from '../lib/types';

export const heroTitle: HeroTitle = {
  lead: 'i work across three territories - the',
  body: 'body',
  midA: 'of the machine, the',
  brain: 'brain',
  midB: 'that runs it, and the',
  rooms: 'rooms',
  tail: 'where others come to build theirs.',
};

export const heroColumns: HeroColumn[] = [
  {
    key: 'body',
    number: '/ 01 - HARDWARE',
    phraseLead: 'I',
    phraseEmphasis: 'design',
    phraseTail: 'the body.',
    caption: 'CAD · torque-controlled actuators · PCBs · things I machine on a Friday night.',
    motifVariant: 'body',
  },
  {
    key: 'brain',
    number: '/ 02 - SOFTWARE',
    phraseLead: 'I',
    phraseEmphasis: 'train',
    phraseTail: 'the brain.',
    caption: 'RL policies · perception · SLAM · sim-to-real · the parts that do not exist without math.',
    motifVariant: 'brain',
    motifStroke: '#E8ECF5',
    motifFill: '#0F1620',
  },
  {
    key: 'rooms',
    number: '/ 03 - ECOSYSTEM',
    phraseLead: 'I',
    phraseEmphasis: 'open',
    phraseTail: 'the rooms.',
    caption: 'summits · hackathons · the spaces where builders find each other and start shipping.',
    motifVariant: 'rooms',
  },
];
