import type { BrainNode, SectionHeader } from '../lib/types';

export const brainHeader: SectionHeader = {
  tag: '/ 02 · BRAIN',
  headingLead: 'I',
  headingEmphasis: 'train',
  headingTail: 'the brain.',
  countTitle: 'SOFTWARE TRACK',
  countMeta: 'RL · CV · SLAM · SIM',
};

export const brainNodes: BrainNode[] = [
  {
    headerLeft: 'policy.pt · PPO',
    headerRight: 'loss ↓ 0.043',
    titleEmphasis: 'walker policy',
    title: 'sim-to-real',
    description:
      'PPO policy trained across 4096 parallel Isaac envs with domain randomization on mass, friction, and motor dynamics. -68% sim-to-real gap vs. baseline.',
    tags: ['hw', 'sw'],
    width: 'w6',
    includeLossCurve: true,
  },
  {
    headerLeft: 'perception.py',
    headerRight: '12Hz · 94%',
    title: 'visual-grasp',
    titleEmphasis: 'ranker',
    description:
      'ResNet-based segmentation into an analytic grasp-ranker. 94% success across 50 novel objects, running on-board at 12 Hz.',
    tags: ['hw', 'sw'],
    width: 'w6',
    codeLines: [
      '# grasp_ranker.py',
      'class GraspRanker(nn.Module):',
      '  def forward(self, rgb, depth):',
      '    return self.head(self.backbone(rgb))',
    ],
  },
  {
    headerLeft: 'slam.cpp',
    headerRight: '±3cm/800m',
    title: 'outdoor',
    titleEmphasis: 'SLAM',
    description:
      'LIO-SAM-based mapping with visual-odometry fallback. Holds ±3 cm drift over 800 m.',
    tags: ['hw', 'sw'],
    width: 'w4',
  },
  {
    headerLeft: 'swarm.py',
    headerRight: '2.1M/s · 50ag',
    title: 'drone',
    titleEmphasis: 'swarm',
    description:
      '50-agent quadrotor swarm in Isaac. Emergent flocking from local rules. 2.1M env-steps/sec.',
    tags: ['sw'],
    width: 'w4',
  },
  {
    headerLeft: 'cartpole.py · SAC',
    headerRight: '<30min',
    title: 'real-world',
    titleEmphasis: 'RL',
    description:
      'Physical cart-pole that learns to balance in under 30 minutes of real interaction.',
    tags: ['hw', 'sw'],
    width: 'w4',
  },
];
