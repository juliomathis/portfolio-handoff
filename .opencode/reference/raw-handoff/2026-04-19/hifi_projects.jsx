/* global React */

// ============= PROJECT LIST =============
const PROJECTS = [
  {
    n: '01', y: '2026',
    t: 'bipedal walker v3',
    ti: 'bipedal walker',
    ti2: 'v3',
    desc: 'A 60cm hand-machined biped that learned to walk in Isaac Sim, then crossed the sim-to-real gap. Trained a PPO policy on a 6-DOF leg with custom torque-controlled actuators.',
    specs: [['stack', 'Isaac Sim · PyTorch · C++ · STM32'], ['result', 'walked 42 m unassisted — first try'], ['role', 'lead · team of 3']],
    tags: ['hardware', 'RL', 'featured'],
    featured: true,
    link: 'Case Study.html',
    media: 'walker.mp4',
  },
  {
    n: '02', y: '2025',
    t: 'slam rover / outdoor',
    ti: 'outdoor', ti2: 'slam rover',
    desc: 'Full-stack autonomous rover for uneven outdoor terrain with a custom LiDAR + IMU rig. LIO-SAM-based mapping with a fallback visual odometry pipeline.',
    specs: [['stack', 'ROS2 · C++ · Python · LiDAR'], ['result', '±3 cm drift over 800 m traverse'], ['role', 'solo']],
    tags: ['navigation', 'perception'],
    media: 'rover.mp4',
  },
  {
    n: '03', y: '2025',
    t: 'visual-grasp arm',
    ti: 'visual-grasp', ti2: 'arm',
    desc: 'A 6-DOF arm that grasps novel objects from a cluttered bin. ResNet-based segmentation into an analytic grasp-ranker, running at 12 Hz on-board.',
    specs: [['stack', 'PyTorch · OpenCV · CUDA · MoveIt'], ['result', '94% success across 50 novel objects'], ['role', 'perception lead']],
    tags: ['computer vision', 'manipulation'],
    media: 'arm.gif',
  },
  {
    n: '04', y: '2025',
    t: 'drone swarm sim',
    ti: 'drone', ti2: 'swarm',
    desc: 'Fifty-agent quadrotor swarm in Isaac Sim with emergent flocking from local rules. Parallelized training harness pushed throughput to 2.1M steps/sec.',
    specs: [['stack', 'Isaac Sim · Python · CUDA'], ['result', '2.1M steps/sec · 50 agents'], ['role', 'solo research']],
    tags: ['simulation', 'multi-agent'],
    media: 'swarm.mp4',
  },
  {
    n: '05', y: '2024',
    t: 'tactile gripper',
    ti: 'tactile', ti2: 'gripper',
    desc: 'Compliant two-finger gripper with integrated capacitive touch sensing. CAD, firmware, and the control PCB all designed from scratch. Patent pending.',
    specs: [['stack', 'SolidWorks · STM32 · KiCad'], ['result', 'detects 5g objects · patent pending'], ['role', 'solo']],
    tags: ['hardware', 'sensors'],
    media: 'gripper.jpg',
  },
  {
    n: '06', y: '2024',
    t: 'rl cart-pole bot',
    ti: 'rl', ti2: 'cart-pole',
    desc: 'A physical inverted-pendulum cart that learns to balance in under 30 minutes of real-world interaction, using SAC with a learned dynamics prior.',
    specs: [['stack', 'PyTorch · Arduino · Python'], ['result', 'sim-to-real in <30 min'], ['role', 'solo']],
    tags: ['ML', 'control'],
    media: 'cartpole.gif',
  },
  {
    n: '07', y: '2023',
    t: 'campus delivery rover',
    ti: 'campus', ti2: 'delivery rover',
    desc: 'Club project — a 4-wheel differential rover that delivered snacks across campus during finals. 6-person team, won the university robotics showcase.',
    specs: [['stack', 'ROS2 · C++ · full stack'], ['result', '1st place · campus showcase'], ['role', 'team lead — 6 people']],
    tags: ['full stack', 'SLAM'],
    media: 'delivery.jpg',
  },
];

function Projects() {
  return (
    <div className="section" id="work">
      <div className="sec-head">
        <div className="sec-head-num">// 01</div>
        <h2>selected <em>work</em></h2>
        <div className="sec-head-count">07 ITEMS ↓ · θ=000°</div>
      </div>

      {PROJECTS.map(p => (
        <div className="project" key={p.n}>
          <div>
            <div className="idx">
              {p.n}
              <span className="year">{p.y}</span>
            </div>
          </div>
          <div>
            <h3>{p.ti} <em>{p.ti2}</em></h3>
            <p className="desc">{p.desc}</p>
            <dl className="specs">
              {p.specs.map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt>// {k}</dt>
                  <dd>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
            <div className="tags">
              {p.tags.map(t => (
                <span key={t} className={`tag ${t === 'featured' ? 'accent' : ''}`}>{t}</span>
              ))}
            </div>
            {p.link
              ? <a href={p.link} className="cta featured">read case study →</a>
              : <span className="cta">case study · coming soon</span>
            }
          </div>
          <div className={`media ${p.featured ? '' : ''}`}>
            <div className={`img-ph ${p.featured ? 'accent' : ''}`} style={{aspectRatio: '4/3'}}>
              <span className="ph-label">{p.media}</span>
              <span className="ph-meta">1920 × 1080</span>
            </div>
            {p.media.endsWith('.mp4') && (
              <div className="play">
                <div className="circle"><div className="tri"/></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

window.Projects = Projects;
window.PROJECTS = PROJECTS;
