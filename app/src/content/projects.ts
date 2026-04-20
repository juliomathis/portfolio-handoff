import type { DomainTag, Project } from '../lib/types';

export const projectsIntro =
  'Every project sits in one, two, or three territories. The overlap is where things get interesting: a hardware kit that exists because a summit needed demo material, or a walking robot whose policy was workshopped in one of the rooms.';

export const vennLegend: Record<DomainTag, string> = {
  hw: 'I designed or fabricated hardware.',
  sw: 'I wrote the intelligence.',
  eco: 'I built the space or event around it.',
};

export const allProjects: Project[] = [
  {
    title: 'bipedal walker v3',
    year: '2026',
    hw: true,
    sw: true,
    eco: false,
    description: 'Hand-built biped paired with PPO policy and sim-to-real transfer.',
  },
  {
    title: 'slam rover outdoor',
    year: '2025',
    hw: true,
    sw: true,
    eco: false,
    description: 'Custom chassis integrated with a LIO-SAM navigation stack.',
  },
  {
    title: 'visual-grasp arm',
    year: '2025',
    hw: true,
    sw: true,
    eco: false,
    description: 'Manipulator platform and CV pipeline for grasping novel objects.',
  },
  {
    title: 'drone swarm sim',
    year: '2025',
    hw: false,
    sw: true,
    eco: false,
    description: 'Parallelized reinforcement learning experiments for drone swarms in Isaac.',
  },
  {
    title: 'tactile gripper',
    year: '2024',
    hw: true,
    sw: false,
    eco: false,
    description: 'Compliant gripper with capacitive touch and patent-pending architecture.',
  },
  {
    title: 'rl cart-pole bot',
    year: '2024',
    hw: true,
    sw: true,
    eco: false,
    description: 'Real-world SAC setup with balance learned in under 30 minutes.',
  },
  {
    title: 'campus delivery rover',
    year: '2023',
    hw: true,
    sw: true,
    eco: true,
    description: 'Club-built delivery rover launched publicly at a campus summit.',
  },
  {
    title: 'robotics builders summit',
    year: '2024-',
    hw: false,
    sw: false,
    eco: true,
    description: 'Annual regional summit for student robotics builders.',
  },
  {
    title: 'robohack /24',
    year: '2025',
    hw: false,
    sw: false,
    eco: true,
    description: '24-hour robotics hackathon where physical robots are mandatory.',
  },
  {
    title: 'workshop series',
    year: '2024-',
    hw: false,
    sw: false,
    eco: true,
    description: 'Invite-only quarterly sessions for peer review and bench work.',
  },
  {
    title: 'torque actuator kit',
    year: '2025',
    hw: true,
    sw: false,
    eco: true,
    description: 'Open-source actuator kit released for summit demo teams.',
  },
  {
    title: 'sim-to-real paper',
    year: '2025',
    hw: false,
    sw: true,
    eco: false,
    description: 'Research publication on actuator-dynamics transfer and policy robustness.',
  },
];
