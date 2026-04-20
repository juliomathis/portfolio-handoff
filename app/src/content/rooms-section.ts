import type { PosterCard, SectionHeader, SummaryPanel } from '../lib/types';

export const roomsHeader: SectionHeader = {
  section: 'rooms',
  num: '/ 03 - ROOMS',
  title: 'I open the rooms.',
  subtitle: 'ECOSYSTEM TRACK - EVENTS - SUMMITS - HACKS',
};

export const roomPosters: PosterCard[] = [
  {
    title: 'Robotics Builders Summit',
    subtitle: 'The flagship',
    description:
      'Annual gathering founded for student roboticists across the region. It started in a 30-person lecture hall and is now projected at 240 attendees for edition III.',
    imageLabel: 'robotics_builders_summit.jpg',
    size: 'lg',
  },
  {
    title: 'robohack /24',
    subtitle: 'Hack weekend format',
    description:
      '24-hour robotics hackathon where physical robots are required. Led logistics, judging, and partner operations for 18 teams, 6 mentors, and 3 sponsors.',
    imageLabel: 'robohack_24.jpg',
  },
  {
    title: 'workshop series',
    subtitle: 'Small rooms',
    description:
      'Invite-only quarterly working sessions for 12 to 20 builders tackling hard robotics problems with no talks and direct peer review.',
    imageLabel: 'workshop_series.jpg',
  },
];

export const roomsSummary: SummaryPanel = {
  title: 'good work happens where builders meet.',
  body: 'Across summits, hackathons, and workshops, these rooms have convened more than 410 builders and helped launch 17 projects on stage.',
  tags: ['eco'],
};
