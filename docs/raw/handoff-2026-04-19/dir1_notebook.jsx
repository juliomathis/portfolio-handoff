/* global React */
const { useState } = React;

// ============================================
// DIRECTION 1: Engineering Notebook
// ============================================
function DirNotebook() {
  return (
    <div className="nb">
      <div className="nb-page grid-bg">
        <div className="margin-line" />

        <div className="nb-header">
          <div>
            <h1>Robot / portfolio</h1>
            <div className="mono" style={{marginTop: 6, color: 'var(--ink-2)'}}>
              // robotics engineer · senior yr · seeking SU26 internship
            </div>
          </div>
          <div className="stamp">
            LAB NOTEBOOK<br/>
            VOL. 07 / 2026<br/>
            ENTRY #001
          </div>
        </div>

        <div className="nb-nav">
          <a>§ about</a>
          <a>§ projects</a>
          <a>§ research</a>
          <a>§ skills</a>
          <a>§ experience</a>
          <a>§ videos</a>
          <a>§ cv.pdf ↓</a>
        </div>

        {/* ABOUT */}
        <div className="nb-entry">
          <div className="date">04 · 18 · 26</div>
          <div className="sec-label">01 — about</div>
          <h2>hello, i build <span className="hl">autonomous things</span>.</h2>
          <div className="grid2" style={{gap: 24}}>
            <div>
              <div className="tx long"></div>
              <div className="tx long"></div>
              <div className="tx med"></div>
              <div className="tx long lite"></div>
              <div className="tx short lite"></div>
              <div style={{marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap'}}>
                <span className="pill">ROS2</span>
                <span className="pill">C++ / Python</span>
                <span className="pill">PyTorch</span>
                <span className="pill hl">available Jun 2026</span>
              </div>
            </div>
            <div style={{position: 'relative'}}>
              <div className="img-ph" style={{aspectRatio: '4/3'}}>
                <div className="label">self-portrait.jpg</div>
              </div>
              <div className="anno" style={{position: 'absolute', top: -20, right: -30, transform: 'rotate(6deg)'}}>
                ← me in the lab
              </div>
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="nb-entry">
          <div className="sec-label">02 — projects / builds (7)</div>
          <h2>field notes</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
            {[
              {title: 'bipedal walker v3', tag: 'HARDWARE · RL', an: 'favorite'},
              {title: 'slam rover — outdoor', tag: 'NAV · PERCEPTION'},
              {title: 'vision-guided arm pick', tag: 'CV · MANIPULATION'},
              {title: 'drone swarm sim', tag: 'SIM · ISAAC'},
              {title: 'tactile gripper', tag: 'HARDWARE'},
              {title: 'rl-trained cart-pole bot', tag: 'ML · CONTROL'},
              {title: 'campus delivery rover', tag: 'SLAM · FULL STACK', an: 'team lead'},
            ].map((p, i) => (
              <div key={i} className="box" style={{padding: 0, position: 'relative'}}>
                <div className="img-ph" style={{aspectRatio: '16/10', border: 'none', borderBottom: '1.5px solid var(--ink)'}}>
                  <div className="label">{p.title}.gif</div>
                </div>
                <div style={{padding: 12}}>
                  <div className="mono" style={{fontSize: 9, color: 'var(--ink-3)', marginBottom: 4}}>{String(i+1).padStart(2,'0')} / {p.tag}</div>
                  <div style={{fontFamily: 'Caveat, cursive', fontSize: 24, lineHeight: 1, marginBottom: 6}}>{p.title}</div>
                  <div className="tx long lite"></div>
                  <div className="tx med lite"></div>
                </div>
                {p.an && (
                  <div className="anno anno-sm" style={{position: 'absolute', top: -16, right: -8, transform: 'rotate(8deg)', background: 'var(--highlight)', padding: '2px 8px', border: '1.5px solid var(--ink)'}}>
                    ★ {p.an}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RESEARCH */}
        <div className="nb-entry">
          <div className="sec-label">03 — research / publications</div>
          <h2>papers</h2>
          {[1,2,3].map(i => (
            <div key={i} style={{display: 'grid', gridTemplateColumns: '60px 1fr 100px', gap: 14, padding: '12px 0', borderTop: '1px dashed var(--ink)'}}>
              <div className="mono">[0{i}]</div>
              <div>
                <div style={{fontWeight: 600, marginBottom: 4}}>Paper title placeholder — long descriptive version</div>
                <div className="mono" style={{color: 'var(--ink-2)'}}>A. Student, B. Advisor · ICRA 2025 · lead author</div>
              </div>
              <div className="mono" style={{textAlign: 'right'}}>pdf ↓<br/>arxiv ↗</div>
            </div>
          ))}
        </div>

        {/* SKILLS */}
        <div className="nb-entry">
          <div className="sec-label">04 — skills</div>
          <h2>toolkit</h2>
          <div className="grid3" style={{gap: 20}}>
            {['languages', 'frameworks', 'hardware'].map((cat, i) => (
              <div key={cat} className="box dashed">
                <div className="mono" style={{color: 'var(--ink-2)', marginBottom: 8, textTransform: 'uppercase'}}>{cat}</div>
                {['item one', 'item two placeholder', 'item three', 'item four', 'item five'].map((x, j) => (
                  <div key={j} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
                    <span style={{fontSize: 13}}>{x}</span>
                    <div style={{display: 'flex', gap: 2}}>
                      {[0,1,2,3,4].map(k => (
                        <div key={k} style={{width: 10, height: 10, border: '1px solid var(--ink)', background: k <= (4-j) ? 'var(--ink)' : 'transparent'}} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* EXPERIENCE + EDUCATION */}
        <div className="nb-entry">
          <div className="sec-label">05 — experience & education</div>
          <h2>timeline</h2>
          <div style={{position: 'relative', paddingLeft: 24}}>
            <div style={{position: 'absolute', left: 6, top: 4, bottom: 4, width: 1.5, background: 'var(--ink)'}} />
            {[
              {y: '2025', t: 'Research Assistant — Autonomy Lab', k: 'role'},
              {y: '2024', t: 'Robotics Intern — Company X', k: 'internship'},
              {y: '2023', t: 'B.S. Mechanical Eng — University Y', k: 'edu'},
              {y: '2022', t: 'Team Lead — Campus Robotics Club', k: 'role'},
            ].map((r, i) => (
              <div key={i} style={{marginBottom: 16, position: 'relative'}}>
                <div style={{position: 'absolute', left: -24, top: 6, width: 13, height: 13, border: '1.5px solid var(--ink)', background: 'var(--paper)', borderRadius: '50%'}}/>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div>
                    <div style={{fontWeight: 600}}>{r.t}</div>
                    <div className="tx med lite" style={{marginTop: 6}}></div>
                  </div>
                  <div className="mono" style={{color: 'var(--ink-2)'}}>{r.y}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIDEOS */}
        <div className="nb-entry">
          <div className="sec-label">06 — videos / demos</div>
          <h2>it moves</h2>
          <div className="grid3">
            {[1,2,3].map(i => (
              <div key={i} className="img-ph" style={{aspectRatio: '16/10', position: 'relative'}}>
                <div className="label">demo_{i}.mp4</div>
                <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{width: 40, height: 40, border: '2px solid var(--ink)', borderRadius: '50%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{width: 0, height: 0, borderLeft: '10px solid var(--ink)', borderTop: '7px solid transparent', borderBottom: '7px solid transparent', marginLeft: 3}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign: 'center', paddingTop: 30, borderTop: '2px solid var(--ink)'}}>
          <div className="anno" style={{fontSize: 28}}>— end of notebook —</div>
          <div className="mono" style={{marginTop: 8, color: 'var(--ink-2)'}}>contact · robot@placeholder.edu · github ↗ · linkedin ↗</div>
        </div>
      </div>
    </div>
  );
}

window.DirNotebook = DirNotebook;
