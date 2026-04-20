import type { DomainTag, FilterKey, Project } from './types';

const DOMAIN_TAGS: DomainTag[] = ['hw', 'sw', 'eco'];

const countMatchingDomains = (project: Project): number =>
  DOMAIN_TAGS.reduce((count, domainTag) => count + Number(project[domainTag]), 0);

export const filterProjects = (projects: Project[], filter: FilterKey): Project[] => {
  if (filter === 'all') {
    return projects;
  }

  if (filter === 'overlap') {
    return projects.filter((project) => countMatchingDomains(project) >= 2);
  }

  if (filter === 'trinity') {
    return projects.filter((project) => countMatchingDomains(project) === DOMAIN_TAGS.length);
  }

  return projects.filter((project) => project[filter]);
};
