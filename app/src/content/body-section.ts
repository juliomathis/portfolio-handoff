import type { BodyCard, SectionHeader } from '../lib/types';

export const bodyHeader: SectionHeader = {
  tag: '/ 01 · BODY',
  headingLead: 'I',
  headingEmphasis: 'design',
  headingTail: 'the body.',
  countTitle: 'HARDWARE TRACK',
  countMeta: 'CAD · PCB · FAB · METAL',
};

export const bodyCards: BodyCard[] = [
  {
    headerLeft: 'DWG-001 · BIPED-V3',
    headerRight: 'SCALE 1:4',
    imageLabel: 'biped_hero.jpg',
    title: 'bipedal',
    titleEmphasis: 'walker v3',
    description:
      '60cm hand-machined biped with torque-controlled BLDC actuators. Designed around sim-to-real: the simulated and real drivetrain actually agree. Walked 42m on first boot.',
    tags: ['hw', 'sw'],
    large: true,
  },
  {
    headerLeft: 'DWG-002 · GRIPPER',
    headerRight: 'REV B',
    imageLabel: 'gripper.cad',
    title: 'tactile',
    titleEmphasis: 'gripper',
    description:
      'Compliant two-finger end-effector with integrated capacitive touch. Firmware, PCB, and mechanical - all mine. Patent pending.',
    tags: ['hw'],
  },
  {
    headerLeft: 'DWG-003 · ROVER',
    headerRight: 'OUTDOOR',
    imageLabel: 'rover_chassis.jpg',
    title: 'slam',
    titleEmphasis: 'rover',
    description:
      'Custom LiDAR+IMU mount on a differential chassis. Designed for uneven terrain and rain. All the brackets are water-jet aluminum.',
    tags: ['hw', 'sw'],
  },
  {
    headerLeft: 'DWG-004 · ACTUATOR',
    headerRight: 'TORQUE 8Nm',
    imageLabel: 'actuator_exploded.png',
    title: 'torque',
    titleEmphasis: 'actuator',
    description:
      "Custom BLDC actuator with on-board torque sensing and a magnetic encoder. The secret sauce behind the biped's sim-to-real transfer.",
    tags: ['hw'],
  },
];
