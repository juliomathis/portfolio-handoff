import type { PosterCard, SectionHeader, SummaryPanel } from '../lib/types';

export const roomsHeader: SectionHeader = {
  tag: '/ 03 · ROOMS',
  headingLead: 'I',
  headingEmphasis: 'open',
  headingTail: 'the rooms.',
  countTitle: 'ECOSYSTEM TRACK',
  countMeta: 'EVENTS · SUMMITS · HACKS',
};

export const roomPosters: PosterCard[] = [
  {
    large: true,
    stubLeft: 'EST. 2024',
    stubRight: 'N° 01',
    kicker: 'The flagship -',
    title: 'the Robotics',
    titleEmphasis: 'Builders Summit',
    description:
      'An annual gathering I founded for student roboticists across the region. Two days, live demos, late-night hacking. Started in a 30-person lecture hall; now it fills a real one.',
    statValue: '240',
    statLabel: '// attendees · edition III (projected)',
    tags: ['eco'],
  },
  {
    variant: 'accent',
    stubLeft: 'WEEKEND FORMAT',
    stubRight: '24 HR',
    kicker: 'Hack -',
    title: 'robo',
    titleEmphasis: 'hack /24',
    description:
      '24-hour robotics hackathon. Physical robots required - no pure-software entries. I ran logistics, judging, and the midnight pizza.',
    statLabel: '// 18 teams · 6 mentors · 3 sponsors',
    tags: ['eco'],
  },
  {
    variant: 'dark',
    stubLeft: 'INVITE-ONLY',
    stubRight: 'QUARTERLY',
    kicker: 'Small rooms -',
    title: 'the',
    titleEmphasis: 'workshop series',
    description:
      'Quarterly closed-door working sessions for 12-20 builders working on hard problems. No talks. Just bench time and peer review.',
    statLabel: '// 4 sessions / yr · 64 builders to date',
    tags: ['eco'],
  },
];

export const roomsSummary: SummaryPanel = {
  kicker: 'Why rooms -',
  titleLine1: 'good work',
  titleLine2: 'happens where',
  emphasis: 'builders meet.',
  totalBuilders: '410+',
  launchedProjects: '17',
};
