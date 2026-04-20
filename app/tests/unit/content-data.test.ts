import { describe, expect, it } from 'vitest';
import { bodyCards, bodyHeader } from '../../src/content/body-section';
import { heroColumns, heroTitle } from '../../src/content/hero';
import { navBrand, navLinks, siteMeta } from '../../src/content/site';

describe('site content data', () => {
  it('matches nav metadata and links from the handoff', () => {
    expect(siteMeta).toEqual({
      title: 'Robot - Body / Brain / Rooms',
      description:
        'I work across three territories: the body of the machine, the brain that runs it, and the rooms where others come to build theirs.',
      topLeft: 'o portfolio_2026 - triptych',
      topRight: 'robot - senior - robotics - ecosystem builder',
    });

    expect(navBrand).toBe('robot.dev');
    expect(navLinks).toEqual([
      { label: '/ body', href: '#body', section: 'body' },
      { label: '/ brain', href: '#brain', section: 'brain' },
      { label: '/ rooms', href: '#rooms', section: 'rooms' },
      { label: '/ all projects', href: '#all', section: 'projects' },
      { label: '/ contact', href: '#contact', section: 'contact' },
    ]);
  });
});

describe('hero content data', () => {
  it('contains title and triptych columns with motif settings', () => {
    expect(heroTitle).toBe(
      'i work across three territories - the body of the machine, the brain that runs it, and the rooms where others come to build theirs.',
    );
    expect(heroColumns).toEqual([
      {
        num: '/ 01 - HARDWARE',
        phrase: 'I design the body.',
        emphasis: 'design',
        caption:
          'CAD - torque-controlled actuators - PCBs - things I machine on a Friday night.',
        motifVariant: 'body',
      },
      {
        num: '/ 02 - SOFTWARE',
        phrase: 'I train the brain.',
        emphasis: 'train',
        caption: 'RL policies - perception - SLAM - sim-to-real - the parts that do not exist without math.',
        motifVariant: 'brain',
        motifStroke: '#E8ECF5',
        motifFill: '#0F1620',
      },
      {
        num: '/ 03 - ECOSYSTEM',
        phrase: 'I open the rooms.',
        emphasis: 'open',
        caption:
          'summits - hackathons - the spaces where builders find each other and start shipping.',
        motifVariant: 'rooms',
      },
    ]);
  });
});

describe('body section content data', () => {
  it('contains body header and four CAD cards from handoff', () => {
    expect(bodyHeader).toEqual({
      section: 'body',
      num: '/ 01 - BODY',
      title: 'I design the body.',
      subtitle: 'HARDWARE TRACK - CAD - PCB - FAB - METAL',
    });

    expect(bodyCards).toEqual([
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
    ]);
  });
});
