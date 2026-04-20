import type { BodyCard, SectionHeader } from '../lib/types';

export const bodyHeader: SectionHeader = {
  section: 'body',
  num: '/ 01 - BODY',
  title: 'I design the body.',
  subtitle: 'HARDWARE TRACK - CAD - PCB - FAB - METAL',
};

export const bodyCards: BodyCard[] = [
  {
    title: 'bipedal walker v3',
    description:
      '60cm hand-machined biped with torque-controlled BLDC actuators. Designed around sim-to-real: the simulated and real drivetrain actually agree. Walked 42m on first boot.',
    imageLabel: 'biped_hero.jpg',
    size: 'lg',
  },
  {
    title: 'tactile gripper',
    description:
      'Compliant two-finger end-effector with integrated capacitive touch. Firmware, PCB, and mechanical - all mine. Patent pending.',
    imageLabel: 'gripper.cad',
  },
  {
    title: 'slam rover',
    description:
      'Custom LiDAR+IMU mount on a differential chassis. Designed for uneven terrain and rain. All the brackets are water-jet aluminum.',
    imageLabel: 'rover_chassis.jpg',
  },
  {
    title: 'torque actuator',
    description:
      "Custom BLDC actuator with on-board torque sensing and a magnetic encoder. The secret sauce behind the biped's sim-to-real transfer.",
    imageLabel: 'actuator_exploded.png',
  },
];
