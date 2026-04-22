import { useMemo, useState } from 'react';
import { filterProjects } from '../lib/filter-projects';
import type { FilterKey, Project } from '../lib/types';

type FilterOption = {
  key: FilterKey;
  label: string;
  tone?: 'hw' | 'sw' | 'eco';
};

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'all' },
  { key: 'hw', label: 'hardware', tone: 'hw' },
  { key: 'sw', label: 'software', tone: 'sw' },
  { key: 'eco', label: 'ecosystem', tone: 'eco' },
  { key: 'overlap', label: '2+ domains' },
  { key: 'trinity', label: 'all 3' },
];

const DOMAIN_ORDER = ['hw', 'sw', 'eco'] as const;

type Props = {
  projects: Project[];
};

const isFilterActive = (activeFilter: FilterKey, option: FilterOption): boolean => activeFilter === option.key;

const filterButtonLabel = (projects: Project[], option: FilterOption): string => {
  if (option.key === 'all') {
    return `${option.label} (${projects.length})`;
  }

  return option.label;
};

const domainSlotClassName = (project: Project, domainKey: (typeof DOMAIN_ORDER)[number]): string =>
  project[domainKey] ? `dom-slot on ${domainKey}` : 'dom-slot off';

const domainLabel = (domainKey: (typeof DOMAIN_ORDER)[number]): string => domainKey.toUpperCase();

export default function ProjectFilter({ projects }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all');

  const visibleProjects = useMemo(() => filterProjects(projects, filter), [projects, filter]);

  return (
    <>
      <div className="filter-bar">
        <span className="lbl">// filter</span>
        {FILTER_OPTIONS.map((option) => {
          const toneClass = option.tone ? ` ${option.tone}` : '';
          const activeClass = isFilterActive(filter, option) ? ' active' : '';

          return (
            <button
              key={option.key}
              className={`filter-btn${toneClass}${activeClass}`}
              onClick={() => setFilter(option.key)}
              aria-pressed={isFilterActive(filter, option)}
              type="button"
            >
              {filterButtonLabel(projects, option)}
            </button>
          );
        })}
      </div>

      <div className="proj-grid">
        {visibleProjects.map((project) => (
          <article className="proj-card" key={`${project.title}-${project.year}`}>
            <div className="domains">
              {DOMAIN_ORDER.map((domainKey) => (
                <div className={domainSlotClassName(project, domainKey)} key={domainKey}>
                  {domainLabel(domainKey)}
                </div>
              ))}
            </div>

            <h4>{project.title}</h4>
            <p>{project.description}</p>
            <div className="year">/ {project.year}</div>
          </article>
        ))}
      </div>
    </>
  );
}
