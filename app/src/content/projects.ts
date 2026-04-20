import type { Project } from '../lib/types';

export const projectsIntro =
  'Every project sits in one, two, or three territories. The overlap is where things get interesting - a hardware kit that exists because a summit needed demo material; a walking robot whose policy was workshopped in one of the rooms.';

export const vennLegend = [
  { key: 'HW', text: 'I designed or fabricated hardware.' },
  { key: 'SW', text: 'I wrote the intelligence.' },
  { key: 'ECO', text: 'I built the space / event around it.' },
] as const;

export const allProjects: Project[] = [
  {
    title: 'bipedal walker v3',
    year: '2026',
    hw: true,
    sw: true,
    eco: false,
    description: 'Hand-built biped + PPO policy · sim-to-real.',
  },
  {
    title: 'slam rover outdoor',
    year: '2025',
    hw: true,
    sw: true,
    eco: false,
    description: 'Custom chassis + LIO-SAM nav stack.',
  },
  {
    title: 'visual-grasp arm',
    year: '2025',
    hw: true,
    sw: true,
    eco: false,
    description: 'Arm + CV pipeline grasping novel objects.',
  },
  {
    title: 'drone swarm sim',
    year: '2025',
    hw: false,
    sw: true,
    eco: false,
    description: 'Parallelized swarm RL in Isaac Sim.',
  },
  {
    title: 'tactile gripper',
    year: '2024',
    hw: true,
    sw: false,
    eco: false,
    description: 'Compliant gripper with cap touch, patent pending.',
  },
  {
    title: 'rl cart-pole bot',
    year: '2024',
    hw: true,
    sw: true,
    eco: false,
    description: 'Real-world SAC, sim-to-real in 30 min.',
  },
  {
    title: 'campus delivery rover',
    year: '2023',
    hw: true,
    sw: true,
    eco: true,
    description: 'Club project; launched live at a campus summit.',
  },
  {
    title: 'robotics builders summit',
    year: '2024-',
    hw: false,
    sw: false,
    eco: true,
    description: 'Annual regional student robotics summit.',
  },
  {
    title: 'robohack /24',
    year: '2025',
    hw: false,
    sw: false,
    eco: true,
    description: '24-hour hardware-required hackathon.',
  },
  {
    title: 'workshop series',
    year: '2024-',
    hw: false,
    sw: false,
    eco: true,
    description: 'Invite-only quarterly working sessions.',
  },
  {
    title: 'torque actuator kit',
    year: '2025',
    hw: true,
    sw: false,
    eco: true,
    description: 'Open-source kit released at the summit.',
  },
  {
    title: 'sim-to-real paper',
    year: '2025',
    hw: false,
    sw: true,
    eco: false,
    description: 'ICRA 2025 · actuator-dynamics transfer.',
  },
];
