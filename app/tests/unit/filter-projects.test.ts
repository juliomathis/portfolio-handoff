import { describe, expect, it } from 'vitest';
import { filterProjects } from '../../src/lib/filter-projects';
import type { Project } from '../../src/lib/types';

const PROJECTS: Project[] = [
  {
    title: 'hardware solo',
    year: '2026',
    hw: true,
    sw: false,
    eco: false,
    description: 'Hardware-only project.',
  },
  {
    title: 'software solo',
    year: '2026',
    hw: false,
    sw: true,
    eco: false,
    description: 'Software-only project.',
  },
  {
    title: 'ecology solo',
    year: '2026',
    hw: false,
    sw: false,
    eco: true,
    description: 'Ecology-only project.',
  },
  {
    title: 'hardware + software',
    year: '2025',
    hw: true,
    sw: true,
    eco: false,
    description: 'Overlapping hardware and software.',
  },
  {
    title: 'software + ecology',
    year: '2025',
    hw: false,
    sw: true,
    eco: true,
    description: 'Overlapping software and ecology.',
  },
  {
    title: 'hardware + ecology',
    year: '2025',
    hw: true,
    sw: false,
    eco: true,
    description: 'Overlapping hardware and ecology.',
  },
  {
    title: 'trinity project',
    year: '2024',
    hw: true,
    sw: true,
    eco: true,
    description: 'Hardware, software, and ecology together.',
  },
];

const projectTitles = (projects: Project[]) => projects.map((project) => project.title);

describe('filterProjects', () => {
  it('filters projects across all supported keys', () => {
    expect(projectTitles(filterProjects(PROJECTS, 'all'))).toEqual(projectTitles(PROJECTS));
    expect(projectTitles(filterProjects(PROJECTS, 'hw'))).toEqual([
      'hardware solo',
      'hardware + software',
      'hardware + ecology',
      'trinity project',
    ]);
    expect(projectTitles(filterProjects(PROJECTS, 'sw'))).toEqual([
      'software solo',
      'hardware + software',
      'software + ecology',
      'trinity project',
    ]);
    expect(projectTitles(filterProjects(PROJECTS, 'eco'))).toEqual([
      'ecology solo',
      'software + ecology',
      'hardware + ecology',
      'trinity project',
    ]);
    expect(projectTitles(filterProjects(PROJECTS, 'overlap'))).toEqual([
      'hardware + software',
      'software + ecology',
      'hardware + ecology',
      'trinity project',
    ]);
    expect(projectTitles(filterProjects(PROJECTS, 'trinity'))).toEqual(['trinity project']);
  });
});
