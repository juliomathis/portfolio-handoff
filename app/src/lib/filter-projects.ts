import type { FilterKey, Project } from './types';

export const filterProjects = (projects: Project[], filter: FilterKey): Project[] => {
  if (filter === 'all') {
    return projects;
  }

  if (filter === 'overlap') {
    return projects.filter((project) => Number(project.hw) + Number(project.sw) + Number(project.eco) >= 2);
  }

  if (filter === 'trinity') {
    return projects.filter((project) => project.hw && project.sw && project.eco);
  }

  return projects.filter((project) => project[filter]);
};
