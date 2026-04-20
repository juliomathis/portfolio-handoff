import type { NavLink, SiteDisplayMeta } from '../lib/types';

export const siteMeta: SiteDisplayMeta = {
  title: 'Robot - Body / Brain / Rooms',
  description:
    'I work across three territories: the body of the machine, the brain that runs it, and the rooms where others come to build theirs.',
  topLeft: 'o portfolio_2026 - triptych',
  topRight: 'robot - senior - robotics - ecosystem builder',
};

export const navBrand = 'robot.dev';

export const navLinks: NavLink[] = [
  { label: '/ body', href: '#body', section: 'body' },
  { label: '/ brain', href: '#brain', section: 'brain' },
  { label: '/ rooms', href: '#rooms', section: 'rooms' },
  { label: '/ all projects', href: '#all', section: 'projects' },
  { label: '/ contact', href: '#contact', section: 'contact' },
];
