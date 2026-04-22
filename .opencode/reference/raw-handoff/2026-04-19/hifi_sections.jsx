/* global React */

// ============= RESEARCH =============
function Research() {
  const papers = [
    {venue: 'ICRA 2025 · 1st author', title: 'Sim-to-real transfer for bipedal gaits via learned actuator dynamics', desc: 'A residual model that learns torque-step response from a 5-min real-robot calibration, cutting sim-to-real gap by 68%.', authors: 'R. Student, B. Advisor, C. Collaborator'},
    {venue: 'CoRL 2024 · co-author', title: 'Tactile-first grasping: letting the hand decide', desc: 'Using distributed capacitive sensing to re-plan grasps in-contact. Improves robustness on deformable and novel objects.', authors: 'A. Author, R. Student, et al.'},
    {venue: 'Workshop @ NeurIPS 2024', title: 'Fast parallel training of quadrotor swarms in Isaac', desc: 'Engineering writeup on scaling on-policy RL to 50-agent swarms on a single GPU. Achieves 2.1M env-steps/sec.', authors: 'R. Student'},
  ];

  return (
    <div className="section" id="research">
      <div className="sec-head">
        <div className="sec-head-num">// 02</div>
        <h2><em>research</em></h2>
        <div className="sec-head-count">03 PAPERS · θ=045°</div>
      </div>

      <div className="research-grid">
        {papers.map((p, i) => (
          <div className="paper" key={i}>
            <div className="venue">{p.venue}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="authors">{p.authors}</div>
            <div className="links">
              <a href="#">arxiv ↗</a>
              <a href="#">pdf ↓</a>
              <a href="#">code ↗</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= SKILLS =============
function Skills() {
  const cols = [
    {t: 'languages', items: [['C++', 5], ['Python', 5], ['Rust', 3], ['MATLAB', 4], ['TypeScript', 3]]},
    {t: 'frameworks', items: [['ROS 2', 5], ['PyTorch', 5], ['Isaac Sim', 4], ['OpenCV', 4], ['MoveIt', 3]]},
    {t: 'hardware', items: [['SolidWorks', 5], ['STM32 / Arduino', 5], ['KiCad (PCB)', 3], ['3D print · CNC', 4], ['sensor fusion', 4]]},
  ];

  return (
    <div className="section" id="skills">
      <div className="sec-head">
        <div className="sec-head-num">// 03</div>
        <h2><em>toolkit</em></h2>
        <div className="sec-head-count">15 ENTRIES · θ=090°</div>
      </div>

      <div className="skills-grid">
        {cols.map(c => (
          <div className="skills-col" key={c.t}>
            <h4><span>// {c.t}</span><span>{c.items.length}</span></h4>
            <ul>
              {c.items.map(([n, lvl]) => (
                <li key={n}>
                  <span>{n}</span>
                  <span className="meter">
                    {[1,2,3,4,5].map(i => <span key={i} className={`tick ${i <= lvl ? 'on' : ''}`}/>)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= CV =============
function CV() {
  const rows = [
    {y: '2025 —', r: 'Research', re: ' assistant', w: 'Autonomy Lab · University Y'},
    {y: '2024',   r: 'Robotics', re: ' intern',    w: 'Company X · 12 weeks · Boston'},
    {y: '2023',   r: 'B.S.',     re: ' mech eng',  w: 'University Y · honors · GPA 3.9'},
    {y: '2022',   r: 'Team',     re: ' lead',      w: 'Campus Robotics Club · 30 members'},
  ];

  return (
    <div className="section dark" id="about">
      <div className="sec-head">
        <div className="sec-head-num">// 04</div>
        <h2><em>cv</em> / timeline</h2>
        <div className="sec-head-count">04 ENTRIES · θ=135°</div>
      </div>

      {rows.map((r, i) => (
        <a key={i} className="cv-row" href="#">
          <div className="year">{r.y}</div>
          <div className="role">{r.r}<em>{r.re}</em></div>
          <div className="where">{r.w}</div>
          <div className="arr">→</div>
        </a>
      ))}
    </div>
  );
}

// ============= VIDEOS =============
function Videos() {
  return (
    <div className="section" id="videos">
      <div className="sec-head">
        <div className="sec-head-num">// 05</div>
        <h2>it <em>moves</em></h2>
        <div className="sec-head-count">03 REELS · θ=180°</div>
      </div>

      <div className="vid-grid">
        <div className="img-ph accent" style={{aspectRatio: '16/9'}}>
          <span className="ph-label">reel_2026.mp4</span>
          <span className="ph-meta">2:34 · 1920×1080</span>
          <div className="play"><div className="circle"><div className="tri"/></div></div>
        </div>
        <div className="vid-right">
          <div className="img-ph" style={{aspectRatio: '4/3'}}>
            <span className="ph-label">walker_gait.mp4</span>
            <span className="ph-meta">0:42</span>
            <div className="play"><div className="circle"><div className="tri"/></div></div>
          </div>
          <div className="img-ph dark" style={{aspectRatio: '4/3'}}>
            <span className="ph-label" style={{background: '#141413', color: '#F5F1E8', borderColor: '#F5F1E8'}}>arm_grasp.mp4</span>
            <span className="ph-meta" style={{background: '#141413', color: '#A8A59A', borderColor: '#6F6E68'}}>0:58</span>
            <div className="play"><div className="circle" style={{background: '#141413', borderColor: '#F5F1E8'}}><div className="tri" style={{borderLeftColor: '#F5F1E8'}}/></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= CONTACT =============
function Contact() {
  return (
    <div className="contact" id="contact">
      <div>
        <div className="mono" style={{marginBottom: 20, color: 'var(--ink)', opacity: 0.7}}>// 06 · let's build</div>
        <h2>let's<br/>build <em>things</em></h2>
      </div>
      <div className="contact-info">
        <a href="mailto:robot@placeholder.edu">robot@placeholder.edu →</a>
        <a href="#">github.com/robot →</a>
        <a href="#">linkedin.com/in/robot →</a>
        <a href="#">resume_2026.pdf ↓</a>
        <a href="#">/notes · engineering blog →</a>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">
      <span>© 2026 ROBOT · HAND-BUILT IN HTML · NO TEMPLATES</span>
      <span>v4.2.1 · last build 2026.04.18</span>
    </div>
  );
}

window.Research = Research;
window.Skills = Skills;
window.CV = CV;
window.Videos = Videos;
window.Contact = Contact;
window.Footer = Footer;
