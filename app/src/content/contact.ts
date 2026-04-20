import type { ContactHeading, ContactLink } from '../lib/types';

export const contactHeading: ContactHeading = {
  lead: 'build the',
  body: 'body',
  mid: 'train the',
  brain: 'brain',
  tailLead: 'fill the',
  rooms: 'rooms',
};

export const contactLinks: ContactLink[] = [
  { label: 'robot@placeholder.edu ->', href: 'mailto:robot@placeholder.edu' },
  { label: 'github.com/robot ->', href: '#' },
  { label: 'linkedin.com/in/robot ->', href: '#' },
  { label: 'resume_2026.pdf ↓', href: '#' },
  { label: '/ rooms · upcoming events ->', href: '#' },
];
