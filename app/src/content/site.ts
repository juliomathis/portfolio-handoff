import type { NavBrand, NavLink, SiteMeta } from '../lib/types';

export const siteMeta: SiteMeta = {
  title: 'Robot - Body / Brain / Rooms',
  description:
    'Editorial robotics portfolio spanning hardware, software, and ecosystem-building work.',
  topLeft: '◉ portfolio_2026 · triptych',
  topRight: 'robot · senior · robotics · ecosystem builder',
};

export const navBrand: NavBrand = {
  name: 'robot',
  suffix: '.dev',
};

export const navLinks: NavLink[] = [
  { href: '#body', label: '/ body', accent: 'body' },
  { href: '#brain', label: '/ brain', accent: 'brain' },
  { href: '#rooms', label: '/ rooms', accent: 'rooms' },
  { href: '#all', label: '/ all projects' },
  { href: '#contact', label: '/ contact' },
];
