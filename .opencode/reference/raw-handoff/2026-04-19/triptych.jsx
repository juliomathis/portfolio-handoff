/* global React */
const { useState, useEffect } = React;

// ============ SHARED JOINT-MORPH MOTIF ============
// Robot joint → neural node → network node
function MotifJoint({size = 80, variant = 'body', stroke = '#141413', fill = '#F5F1E8'}) {
  if (variant === 'body') {
    // Mechanical joint: ring + crosshair + axis
    return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="32" fill="none" stroke={stroke} strokeWidth="1.5"/>
        <circle cx="40" cy="40" r="22" fill={fill} stroke={stroke} strokeWidth="1.5"/>
        <line x1="40" y1="8" x2="40" y2="72" stroke={stroke} strokeWidth="1" strokeDasharray="2 3"/>
        <line x1="8" y1="40" x2="72" y2="40" stroke={stroke} strokeWidth="1" strokeDasharray="2 3"/>
        <circle cx="40" cy="40" r="5" fill={stroke}/>
        <text x="40" y="78" fontSize="6" fontFamily="JetBrains Mono" textAnchor="middle" fill={stroke}>JOINT·01</text>
      </svg>
    );
  }
  if (variant === 'brain') {
    // Neural node: center + spokes to small nodes
    return (
      <svg width={size} height={size} viewBox="0 0 80 80">
        {[[12,18],[68,22],[14,62],[66,60],[40,10],[40,70]].map((p,i) => (
          <g key={i}>
            <line x1="40" y1="40" x2={p[0]} y2={p[1]} stroke={stroke} strokeWidth="1" opacity="0.7"/>
            <circle cx={p[0]} cy={p[1]} r="3" fill={stroke}/>
          </g>
        ))}
        <circle cx="40" cy="40" r="10" fill={fill} stroke={stroke} strokeWidth="1.5"/>
        <circle cx="40" cy="40" r="3" fill={stroke}/>
      </svg>
    );
  }
  // rooms: network of people / nodes around a table
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="18" fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2"/>
      {[0,60,120,180,240,300].map((a,i) => {
        const r = 30;
        const x = 40 + r * Math.cos(a * Math.PI/180);
        const y = 40 + r * Math.sin(a * Math.PI/180);
        return <circle key={i} cx={x} cy={y} r="5" fill={fill} stroke={stroke} strokeWidth="1.5"/>;
      })}
      <circle cx="40" cy="40" r="3" fill={stroke}/>
    </svg>
  );
}

// ============ NAV ============
function Nav() {
  return (
    <div className="nav">
      <div className="nav-brand"><div className="joint"/>robot<span style={{color:'var(--ink-3)'}}>.dev</span></div>
      <div className="nav-links">
        <a href="#body" className="body">/ body</a>
        <a href="#brain" className="brain">/ brain</a>
        <a href="#rooms" className="rooms">/ rooms</a>
        <a href="#all">/ all projects</a>
        <a href="#contact">/ contact</a>
      </div>
    </div>
  );
}

// ============ HERO TRIPTYCH ============
function Hero() {
  return (
    <div className="triptych-hero">
      <div className="th-top">
        <span>◉ portfolio_2026 · triptych</span>
        <span>robot · senior · robotics · ecosystem builder</span>
      </div>

      <h1 className="th-title">
        i work across three territories — the <em>body</em> of the machine,
        the <em>brain</em> that runs it, and the <em>rooms</em> where
        others come to build theirs.
      </h1>

      <div className="th-triptych">
        <div className="th-col c-body">
          <div>
            <div className="col-num">/ 01 — HARDWARE</div>
            <div className="col-phrase">I <em>design</em><br/>the body.</div>
            <div className="col-caption">CAD · torque-controlled actuators · PCBs · things I machine on a Friday night.</div>
          </div>
          <MotifJoint variant="body"/>
        </div>

        <div className="th-col c-brain">
          <div>
            <div className="col-num">/ 02 — SOFTWARE</div>
            <div className="col-phrase">I <em>train</em><br/>the brain.</div>
            <div className="col-caption">RL policies · perception · SLAM · sim-to-real · the parts that don't exist without math.</div>
          </div>
          <MotifJoint variant="brain" stroke="#E8ECF5" fill="#0F1620"/>
        </div>

        <div className="th-col c-rooms">
          <div>
            <div className="col-num">/ 03 — ECOSYSTEM</div>
            <div className="col-phrase">I <em>open</em><br/>the rooms.</div>
            <div className="col-caption">summits · hackathons · the spaces where builders find each other and start shipping.</div>
          </div>
          <MotifJoint variant="rooms"/>
        </div>
      </div>
    </div>
  );
}

// ============ MORPH BAR between sections ============
function MorphBar({from, to, fromVariant, toVariant, fromColor = '#F5F1E8', toColor = '#F5F1E8'}) {
  return (
    <div className="morph-bar">
      <span className="from">/ leaving · {from}</span>
      <div style={{display:'flex', alignItems:'center', gap: 8}}>
        <MotifJoint variant={fromVariant} size={40} fill={fromColor}/>
        <span style={{fontFamily:'JetBrains Mono, monospace', fontSize: 14, color:'var(--ink-3)'}}>→</span>
        <MotifJoint variant={toVariant} size={40} fill={toColor}/>
      </div>
      <span className="to">arriving · {to} /</span>
    </div>
  );
}

// ============ BODY SECTION ============
function BodySection() {
  return (
    <div className="sec-body" id="body">
      <div className="sec-head-bar">
        <span className="tag">/ 01 · BODY</span>
        <h2>I <em>design</em> the body.</h2>
        <span className="count">HARDWARE TRACK<br/>CAD · PCB · FAB · METAL</span>
      </div>

      <div className="cad-grid">
        <div className="cad-card lg">
          <div className="corner-ticks"/>
          <div className="hdr"><span>DWG-001 · BIPED-V3</span><span>SCALE 1:4</span></div>
          <div className="image"><span className="lbl">biped_hero.jpg</span></div>
          <h3>bipedal <em>walker v3</em></h3>
          <p>60cm hand-machined biped with torque-controlled BLDC actuators. Designed around sim-to-real: the simulated and real drivetrain actually agree. Walked 42m on first boot.</p>
          <div className="tags-row">
            <span className="dom-tag hw">HARDWARE</span>
            <span className="dom-tag sw">SOFTWARE</span>
          </div>
        </div>

        <div className="cad-card">
          <div className="corner-ticks"/>
          <div className="hdr"><span>DWG-002 · GRIPPER</span><span>REV B</span></div>
          <div className="image"><span className="lbl">gripper.cad</span></div>
          <h3>tactile <em>gripper</em></h3>
          <p>Compliant two-finger end-effector with integrated capacitive touch. Firmware, PCB, and mechanical — all mine. Patent pending.</p>
          <div className="tags-row"><span className="dom-tag hw">HARDWARE</span></div>
        </div>

        <div className="cad-card">
          <div className="corner-ticks"/>
          <div className="hdr"><span>DWG-003 · ROVER</span><span>OUTDOOR</span></div>
          <div className="image"><span className="lbl">rover_chassis.jpg</span></div>
          <h3>slam <em>rover</em></h3>
          <p>Custom LiDAR+IMU mount on a differential chassis. Designed for uneven terrain and rain. All the brackets are water-jet aluminum.</p>
          <div className="tags-row"><span className="dom-tag hw">HARDWARE</span><span className="dom-tag sw">SOFTWARE</span></div>
        </div>

        <div className="cad-card">
          <div className="corner-ticks"/>
          <div className="hdr"><span>DWG-004 · ACTUATOR</span><span>TORQUE 8Nm</span></div>
          <div className="image"><span className="lbl">actuator_exploded.png</span></div>
          <h3><em>torque</em> actuator</h3>
          <p>Custom BLDC actuator with on-board torque sensing and a magnetic encoder. The secret sauce behind the biped's sim-to-real transfer.</p>
          <div className="tags-row"><span className="dom-tag hw">HARDWARE</span></div>
        </div>
      </div>
    </div>
  );
}

// ============ BRAIN SECTION ============
function BrainSection() {
  return (
    <div className="sec-brain" id="brain">
      <div className="sec-head-bar">
        <span className="tag">/ 02 · BRAIN</span>
        <h2>I <em>train</em> the brain.</h2>
        <span className="count" style={{color:'var(--brain-fg-2)'}}>SOFTWARE TRACK<br/>RL · CV · SLAM · SIM</span>
      </div>

      <div className="node-grid">
        <div className="node-card w6">
          <div className="hdr"><span>policy.pt · PPO</span><span>loss ↓ 0.043</span></div>
          <h3>sim-to-real <em>walker policy</em></h3>
          <p>PPO policy trained across 4096 parallel Isaac envs with domain randomization on mass, friction, and motor dynamics. –68% sim-to-real gap vs. baseline.</p>
          <div className="loss-curve"/>
          <div className="tags-row"><span className="dom-tag hw">HW</span><span className="dom-tag sw">SW</span></div>
        </div>

        <div className="node-card w6">
          <div className="hdr"><span>perception.py</span><span>12Hz · 94%</span></div>
          <h3>visual-grasp <em>ranker</em></h3>
          <p>ResNet-based segmentation into an analytic grasp-ranker. 94% success across 50 novel objects, running on-board at 12 Hz.</p>
          <div className="code">
            <span style={{color:'var(--brain-fg-2)'}}># grasp_ranker.py</span><br/>
            <span className="k">class</span> GraspRanker(nn.Module):<br/>
            &nbsp;&nbsp;<span className="k">def</span> forward(self, rgb, depth):<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="s">return</span> self.head(self.backbone(rgb))
          </div>
          <div className="tags-row"><span className="dom-tag hw">HW</span><span className="dom-tag sw">SW</span></div>
        </div>

        <div className="node-card w4">
          <div className="hdr"><span>slam.cpp</span><span>±3cm/800m</span></div>
          <h3>outdoor <em>SLAM</em></h3>
          <p>LIO-SAM-based mapping with visual-odometry fallback. Holds ±3 cm drift over 800 m.</p>
          <div className="tags-row"><span className="dom-tag hw">HW</span><span className="dom-tag sw">SW</span></div>
        </div>

        <div className="node-card w4">
          <div className="hdr"><span>swarm.py</span><span>2.1M/s · 50ag</span></div>
          <h3>drone <em>swarm</em></h3>
          <p>50-agent quadrotor swarm in Isaac. Emergent flocking from local rules. 2.1M env-steps/sec.</p>
          <div className="tags-row"><span className="dom-tag sw">SW</span></div>
        </div>

        <div className="node-card w4">
          <div className="hdr"><span>cartpole.py · SAC</span><span>&lt;30min</span></div>
          <h3>real-world <em>RL</em></h3>
          <p>Physical cart-pole that learns to balance in under 30 minutes of real interaction.</p>
          <div className="tags-row"><span className="dom-tag hw">HW</span><span className="dom-tag sw">SW</span></div>
        </div>
      </div>
    </div>
  );
}

// ============ ROOMS SECTION ============
function RoomsSection() {
  return (
    <div className="sec-rooms" id="rooms">
      <div className="sec-head-bar">
        <span className="tag">/ 03 · ROOMS</span>
        <h2>I <em>open</em> the rooms.</h2>
        <span className="count">ECOSYSTEM TRACK<br/>EVENTS · SUMMITS · HACKS</span>
      </div>

      <div className="poster-grid">
        <div className="poster lg">
          <div className="stub"><span>EST. 2024</span><span>N° 01</span></div>
          <div className="kicker">The flagship —</div>
          <h3>the <em>Robotics</em><br/>Builders<br/>Summit</h3>
          <p>An annual gathering I founded for student roboticists across the region. Two days, live demos, late-night hacking. Started in a 30-person lecture hall; now it fills a real one.</p>
          <div className="big-stat">240</div>
          <div className="stat-lbl">// attendees · edition III (projected)</div>
          <div className="tags-row"><span className="dom-tag eco">ECOSYSTEM</span></div>
        </div>

        <div className="poster accent">
          <div className="stub"><span>WEEKEND FORMAT</span><span>24 HR</span></div>
          <div className="kicker">Hack —</div>
          <h3>robo<em>hack</em> /24</h3>
          <p>24-hour robotics hackathon. Physical robots required — no pure-software entries. I ran logistics, judging, and the midnight pizza.</p>
          <div className="stat-lbl" style={{marginTop: 16}}>// 18 teams · 6 mentors · 3 sponsors</div>
          <div className="tags-row"><span className="dom-tag eco">ECOSYSTEM</span></div>
        </div>

        <div className="poster dark">
          <div className="stub"><span>INVITE-ONLY</span><span>QUARTERLY</span></div>
          <div className="kicker">Small rooms —</div>
          <h3>the <em>workshop</em> series</h3>
          <p>Quarterly closed-door working sessions for 12–20 builders working on hard problems. No talks. Just bench time and peer review.</p>
          <div className="stat-lbl" style={{marginTop: 16}}>// 4 sessions / yr · 64 builders to date</div>
          <div className="tags-row"><span className="dom-tag eco">ECOSYSTEM</span></div>
        </div>

        <div className="poster" style={{gridColumn: 'span 3', minHeight: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, alignItems: 'center'}}>
          <div>
            <div className="kicker">Why rooms —</div>
            <h3 style={{fontSize: 36}}>good work<br/>happens where<br/><em>builders meet.</em></h3>
          </div>
          <div>
            <div className="stat-lbl">// total builders convened</div>
            <div className="big-stat" style={{fontSize: 96, margin: '8px 0'}}>410+</div>
          </div>
          <div>
            <div className="stat-lbl">// projects launched on-stage</div>
            <div className="big-stat" style={{fontSize: 96, margin: '8px 0'}}>17</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ ALL PROJECTS with domain tags + filter ============
const ALL_PROJECTS = [
  {t: 'bipedal walker v3', y: '2026', hw: 1, sw: 1, eco: 0, d: 'Hand-built biped + PPO policy · sim-to-real.'},
  {t: 'slam rover outdoor', y: '2025', hw: 1, sw: 1, eco: 0, d: 'Custom chassis + LIO-SAM nav stack.'},
  {t: 'visual-grasp arm', y: '2025', hw: 1, sw: 1, eco: 0, d: 'Arm + CV pipeline grasping novel objects.'},
  {t: 'drone swarm sim', y: '2025', hw: 0, sw: 1, eco: 0, d: 'Parallelized swarm RL in Isaac Sim.'},
  {t: 'tactile gripper', y: '2024', hw: 1, sw: 0, eco: 0, d: 'Compliant gripper with cap touch, patent pending.'},
  {t: 'rl cart-pole bot', y: '2024', hw: 1, sw: 1, eco: 0, d: 'Real-world SAC, sim-to-real in 30 min.'},
  {t: 'campus delivery rover', y: '2023', hw: 1, sw: 1, eco: 1, d: 'Club project; launched live at a campus summit.'},
  {t: 'robotics builders summit', y: '2024—', hw: 0, sw: 0, eco: 1, d: 'Annual regional student robotics summit.'},
  {t: 'robohack /24', y: '2025', hw: 0, sw: 0, eco: 1, d: '24-hour hardware-required hackathon.'},
  {t: 'workshop series', y: '2024—', hw: 0, sw: 0, eco: 1, d: 'Invite-only quarterly working sessions.'},
  {t: 'torque actuator kit', y: '2025', hw: 1, sw: 0, eco: 1, d: 'Open-source kit released at the summit.'},
  {t: 'sim-to-real paper', y: '2025', hw: 0, sw: 1, eco: 0, d: 'ICRA 2025 · actuator-dynamics transfer.'},
];

function AllProjects() {
  const [filter, setFilter] = useState('all');
  const shown = ALL_PROJECTS.filter(p =>
    filter === 'all' ||
    (filter === 'hw' && p.hw) ||
    (filter === 'sw' && p.sw) ||
    (filter === 'eco' && p.eco) ||
    (filter === 'overlap' && (p.hw + p.sw + p.eco) >= 2) ||
    (filter === 'trinity' && (p.hw + p.sw + p.eco) === 3)
  );

  return (
    <div className="sec-inter" id="all">
      <h2>the <em>whole</em> map.</h2>
      <p className="intro">
        Every project sits in one, two, or three territories. The overlap is where things get interesting —
        a hardware kit that exists because a summit needed demo material; a walking robot whose policy was
        workshopped in one of the rooms.
      </p>

      <div className="venn">
        <svg className="venn-svg" viewBox="0 0 280 180">
          <circle cx="100" cy="80" r="58" fill="oklch(0.82 0.11 130 / 0.5)" stroke="#141413" strokeWidth="1.5"/>
          <circle cx="180" cy="80" r="58" fill="oklch(0.6 0.17 280 / 0.45)" stroke="#141413" strokeWidth="1.5"/>
          <circle cx="140" cy="130" r="58" fill="oklch(0.74 0.15 50 / 0.5)" stroke="#141413" strokeWidth="1.5"/>
          <text x="72" y="50" fontSize="10" fontFamily="JetBrains Mono" fill="#141413">HW</text>
          <text x="200" y="50" fontSize="10" fontFamily="JetBrains Mono" fill="#141413">SW</text>
          <text x="130" y="170" fontSize="10" fontFamily="JetBrains Mono" fill="#141413">ECO</text>
        </svg>
        <div className="venn-legend">
          <span className="dom-tag hw">HW</span><span>— I designed or fabricated hardware.</span>
          <span className="dom-tag sw">SW</span><span>— I wrote the intelligence.</span>
          <span className="dom-tag eco">ECO</span><span>— I built the space / event around it.</span>
        </div>
      </div>

      <div className="filter-bar">
        <span className="lbl">// filter</span>
        <button className={`filter-btn ${filter==='all'?'active':''}`} onClick={() => setFilter('all')}>all ({ALL_PROJECTS.length})</button>
        <button className={`filter-btn hw ${filter==='hw'?'active':''}`} onClick={() => setFilter('hw')}>hardware</button>
        <button className={`filter-btn sw ${filter==='sw'?'active':''}`} onClick={() => setFilter('sw')}>software</button>
        <button className={`filter-btn eco ${filter==='eco'?'active':''}`} onClick={() => setFilter('eco')}>ecosystem</button>
        <button className={`filter-btn ${filter==='overlap'?'active':''}`} onClick={() => setFilter('overlap')}>2+ domains</button>
        <button className={`filter-btn ${filter==='trinity'?'active':''}`} onClick={() => setFilter('trinity')}>all 3</button>
      </div>

      <div className="proj-grid">
        {shown.map((p, i) => (
          <div className="proj-card" key={i}>
            <div className="domains">
              <div className={`dom-slot ${p.hw?'on hw':'off'}`}>HW</div>
              <div className={`dom-slot ${p.sw?'on sw':'off'}`}>SW</div>
              <div className={`dom-slot ${p.eco?'on eco':'off'}`}>ECO</div>
            </div>
            <h4>{p.t}</h4>
            <p>{p.d}</p>
            <div className="year">/ {p.y}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ CONTACT ============
function Contact() {
  return (
    <div className="contact" id="contact">
      <div>
        <div className="mono" style={{color: 'var(--ink-4)', marginBottom: 20}}>// 04 — let's work</div>
        <h2>
          build the <span className="c1">body</span>,<br/>
          train the <span className="c2">brain</span>,<br/>
          fill the <span className="c3">rooms</span>.
        </h2>
      </div>
      <div className="contact-info">
        <a href="mailto:robot@placeholder.edu">robot@placeholder.edu →</a>
        <a href="#">github.com/robot →</a>
        <a href="#">linkedin.com/in/robot →</a>
        <a href="#">resume_2026.pdf ↓</a>
        <a href="#">/ rooms · upcoming events →</a>
      </div>
    </div>
  );
}

function Footer() {
  return <div className="footer"><span>© 2026 ROBOT · TRIPTYCH</span><span>BODY · BRAIN · ROOMS</span></div>;
}

// ============ APP ============
function App() {
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === '__activate_edit_mode') setEditOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setEditOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({type:'__edit_mode_available'}, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <>
      <Nav/>
      <Hero/>
      <MorphBar from="hero" to="body" fromVariant="body" toVariant="body"/>
      <BodySection/>
      <MorphBar from="body (mechanical joint)" to="brain (neural node)" fromVariant="body" toVariant="brain"/>
      <BrainSection/>
      <MorphBar from="brain (neural node)" to="rooms (network)" fromVariant="brain" toVariant="rooms" fromColor="#0F1620"/>
      <RoomsSection/>
      <MorphBar from="rooms" to="the whole map" fromVariant="rooms" toVariant="body"/>
      <AllProjects/>
      <Contact/>
      <Footer/>

      <div className={`tweaks ${editOpen ? 'open' : ''}`}>
        <h3>Tweaks</h3>
        <div style={{fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.6}}>
          Each section has its own distinct visual language. Scroll through body → brain → rooms to see the morph.
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
