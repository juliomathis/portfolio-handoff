import type { BrainNode, SectionHeader } from '../lib/types';

export const brainHeader: SectionHeader = {
  section: 'brain',
  num: '/ 02 - BRAIN',
  title: 'I train the brain.',
  subtitle: 'SOFTWARE TRACK - RL - CV - SLAM - SIM',
};

export const brainNodes: BrainNode[] = [
  {
    title: 'sim-to-real walker policy',
    description:
      'PPO policy trained across 4096 parallel Isaac environments with domain randomization on mass, friction, and motor dynamics. Sim-to-real gap improved by 68 percent over baseline.',
    tags: ['hw', 'sw'],
    width: 'w6',
  },
  {
    title: 'visual-grasp ranker',
    description:
      'ResNet-based segmentation feeds an analytic grasp-ranker. Validated with 94 percent success over 50 novel objects while running on-board at 12 Hz.',
    tags: ['hw', 'sw'],
    width: 'w6',
  },
  {
    title: 'outdoor SLAM',
    description:
      'LIO-SAM mapping pipeline with visual-odometry fallback. Holds drift to plus/minus 3 cm over an 800 m outdoor run.',
    tags: ['hw', 'sw'],
    width: 'w4',
  },
  {
    title: 'drone swarm',
    description:
      'Fifty-agent quadrotor swarm in Isaac with emergent flocking from local rules, sustaining 2.1 million environment steps per second.',
    tags: ['sw'],
    width: 'w4',
  },
  {
    title: 'real-world RL',
    description:
      'Physical cart-pole setup that learns balance in under 30 minutes of real interaction with a sim-to-real training loop.',
    tags: ['hw', 'sw'],
    width: 'w4',
  },
];
