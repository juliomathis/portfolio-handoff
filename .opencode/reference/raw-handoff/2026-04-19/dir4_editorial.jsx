/* global React */

// ============================================
// DIRECTION 4: Bold Editorial Scroll
// ============================================
function DirEditorial() {
  return (
    <div className="ed">
      {/* Top nav */}
      <div className="ed-nav">
        <div style={{fontFamily: 'Caveat, cursive', fontSize: 28, lineHeight: 1}}>robot.</div>
        <div className="links">
          <a>work</a>
          <a>research</a>
          <a>about</a>
          <a>cv ↓</a>
          <a style={{background: 'var(--highlight)', padding: '2px 8px'}}>hire me →</a>
        </div>
      </div>

      {/* Hero */}
      <div className="ed-hero">
        <div className="mono" style={{marginBottom: 20, color: 'var(--ink-2)'}}>◉ portfolio / 2026 / v4</div>
        <h1>i build<br/>robots that<br/><span style={{background: 'var(--highlight)', padding: '0 12px', display: 'inline-block', transform: 'rotate(-1deg)'}}>think.</span></h1>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24}}>
          <div className="sub">
            robotics student · senior · working on autonomous mobility, perception, and reinforcement learning.
            currently seeking a <b>Summer 2026</b> internship.
          </div>
          <div className="anno" style={{transform: 'rotate(-4deg)'}}>
            ↓ scroll for proof
          </div>
        </div>
      </div>

      {/* SELECTED WORK */}
      <div className="ed-section">
        <div className="ed-section-head">
          <span className="num">// 01</span>
          <h2>selected work</h2>
          <span className="mono" style={{marginLeft: 'auto', color: 'var(--ink-2)'}}>7 projects ↓</span>
        </div>

        {[
          {n: '01', t: 'bipedal walker v3', tags: ['hardware', 'RL', 'Isaac'], y: '2026', meta: 'lead · team of 3 · walked 42m unassisted'},
          {n: '02', t: 'slam rover / outdoor', tags: ['nav', 'perception'], y: '2025', meta: 'full stack · ROS2 · custom LiDAR rig'},
          {n: '03', t: 'visual-grasp arm', tags: ['CV', 'manipulation'], y: '2025', meta: '94% grasp success · novel objects'},
          {n: '04', t: 'drone swarm sim', tags: ['sim', 'Isaac'], y: '2025', meta: '50 agents · emergent flocking'},
          {n: '05', t: 'tactile gripper', tags: ['hardware', 'sensors'], y: '2024', meta: 'patent pending · CAD + firmware'},
          {n: '06', t: 'rl cart-pole bot', tags: ['ML', 'control'], y: '2024', meta: 'sim-to-real in <30min'},
          {n: '07', t: 'campus delivery rover', tags: ['full', 'SLAM'], y: '2023', meta: 'team lead · 6 people · winning entry'},
        ].map((p, i) => (
          <div key={i} className="ed-project">
            <div>
              <div className="idx">{p.n}</div>
              <div className="meta" style={{marginTop: 8}}>{p.y}</div>
            </div>
            <div>
              <h3>{p.t}</h3>
              <div className="tx long"></div>
              <div className="tx long lite"></div>
              <div className="tx med lite"></div>
              <div style={{marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap'}}>
                {p.tags.map(t => <span key={t} className="pill" style={{fontSize: 10}}>{t}</span>)}
              </div>
              <div className="meta" style={{marginTop: 10}}>↳ {p.meta}</div>
              <div className="mono" style={{marginTop: 12, fontSize: 11, borderBottom: '1px solid var(--ink)', display: 'inline-block', paddingBottom: 2}}>read case study →</div>
            </div>
            <div className="img-ph" style={{aspectRatio: '4/3'}}>
              <div className="label">{p.t.replace(/[ /]/g, '_')}.gif</div>
            </div>
          </div>
        ))}
      </div>

      {/* RESEARCH */}
      <div className="ed-section" style={{background: 'var(--paper-2)'}}>
        <div className="ed-section-head">
          <span className="num">// 02</span>
          <h2>research</h2>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20}}>
          {[1,2,3].map(i => (
            <div key={i} className="box" style={{background: 'var(--paper)', padding: 20}}>
              <div className="mono" style={{color: 'var(--ink-2)', marginBottom: 10}}>PAPER [0{i}] · ICRA 2025</div>
              <div style={{fontFamily: 'Caveat, cursive', fontSize: 26, lineHeight: 1, marginBottom: 8}}>paper title placeholder</div>
              <div className="tx long"></div>
              <div className="tx long lite"></div>
              <div className="tx short lite"></div>
              <div className="mono" style={{marginTop: 14, fontSize: 10}}>A. Student, B. Advisor · <span style={{borderBottom: '1px solid'}}>arxiv ↗</span> · <span style={{borderBottom: '1px solid'}}>pdf ↓</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* SKILLS — giant list */}
      <div className="ed-section">
        <div className="ed-section-head">
          <span className="num">// 03</span>
          <h2>toolkit</h2>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40}}>
          {[
            {t: 'languages', items: ['C++', 'Python', 'Rust', 'MATLAB', 'JavaScript']},
            {t: 'frameworks', items: ['ROS2', 'PyTorch', 'Isaac Sim', 'OpenCV', 'Gazebo']},
            {t: 'hardware', items: ['SolidWorks', 'Arduino / STM32', 'PCB design', 'Sensors', '3D print / CNC']},
          ].map(g => (
            <div key={g.t}>
              <div className="mono" style={{color: 'var(--ink-2)', marginBottom: 14, borderBottom: '1.5px solid var(--ink)', paddingBottom: 6}}>
                // {g.t}
              </div>
              {g.items.map(x => (
                <div key={x} style={{fontFamily: 'Caveat, cursive', fontSize: 28, lineHeight: 1.2}}>{x}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* EXPERIENCE */}
      <div className="ed-section" style={{background: 'var(--ink)', color: 'var(--paper)'}}>
        <div className="ed-section-head">
          <span className="num" style={{color: 'var(--muted)'}}>// 04</span>
          <h2>cv</h2>
        </div>
        {[
          ['2025 —', 'Research Assistant', 'Autonomy Lab · University Y'],
          ['2024', 'Robotics Intern', 'Company X'],
          ['2023', 'B.S. Mechanical Engineering', 'University Y'],
          ['2022', 'Team Lead', 'Campus Robotics Club'],
        ].map(([y, r, o], i) => (
          <div key={i} style={{display: 'grid', gridTemplateColumns: '140px 1fr 1fr 40px', gap: 20, padding: '18px 0', borderTop: '1px dashed var(--muted)', alignItems: 'center'}}>
            <div className="mono" style={{color: 'var(--muted)'}}>{y}</div>
            <div style={{fontFamily: 'Caveat, cursive', fontSize: 32, lineHeight: 1}}>{r}</div>
            <div className="mono" style={{color: 'var(--muted)'}}>{o}</div>
            <div style={{textAlign: 'right', opacity: 0.6}}>→</div>
          </div>
        ))}
      </div>

      {/* VIDEOS */}
      <div className="ed-section">
        <div className="ed-section-head">
          <span className="num">// 05</span>
          <h2>it moves</h2>
        </div>
        <div className="grid2">
          {[1,2].map(i => (
            <div key={i} className="img-ph" style={{aspectRatio: '16/9', position: 'relative'}}>
              <div className="label">reel_{i}.mp4</div>
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 60, height: 60, border: '2.5px solid var(--ink)', borderRadius: '50%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{width: 0, height: 0, borderLeft: '16px solid var(--ink)', borderTop: '10px solid transparent', borderBottom: '10px solid transparent', marginLeft: 5}} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div className="ed-section" style={{background: 'var(--highlight)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div>
            <div className="mono" style={{marginBottom: 10}}>// 06 / contact</div>
            <div style={{fontFamily: 'Caveat, cursive', fontSize: 96, lineHeight: 0.95, margin: 0}}>
              let's<br/>build ⚙
            </div>
          </div>
          <div className="mono" style={{fontSize: 13, textAlign: 'right', lineHeight: 2}}>
            robot@placeholder.edu<br/>
            github.com/robot<br/>
            linkedin.com/in/robot<br/>
            resume.pdf ↓
          </div>
        </div>
      </div>
    </div>
  );
}

window.DirEditorial = DirEditorial;
