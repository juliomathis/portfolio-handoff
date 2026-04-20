/* global React */

// ============================================
// DIRECTION 3: Schematic / Circuit Grid
// ============================================
function DirSchematic() {
  return (
    <div className="sch">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6}}>
        <div>
          <div className="mono" style={{color: 'var(--ink-2)', marginBottom: 4}}>DWG-001 · ROBOT.PORTFOLIO · REV 4</div>
          <h1 className="sch-title">robotics / portfolio</h1>
        </div>
        <div className="mono" style={{textAlign: 'right', fontSize: 10, lineHeight: 1.6}}>
          DATE: 2026.04.18<br/>
          SHEET: 1 OF 1<br/>
          AUTHOR: ROBOT<br/>
          STATUS: <span style={{background: 'var(--highlight)', padding: '0 4px'}}>OPEN TO WORK</span>
        </div>
      </div>
      <div className="sch-sub">
        <span>// schematic view — click any node to expand case study</span>
        <span>sig ∿ robot@placeholder.edu · github ↗ · linkedin ↗ · cv.pdf</span>
      </div>

      {/* Title block w/ nav as "pins" */}
      <div style={{display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap'}}>
        {['[A] about', '[B] projects', '[C] research', '[D] skills', '[E] experience', '[F] videos'].map(n => (
          <div key={n} className="pill">{n}</div>
        ))}
      </div>

      {/* Main schematic canvas with nodes */}
      <div style={{position: 'relative'}}>
        <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0}}>
          <defs>
            <pattern id="dash" patternUnits="userSpaceOnUse" width="6" height="2">
              <rect width="3" height="2" fill="#1A1A1A"/>
            </pattern>
          </defs>
          {/* connecting traces drawn as stepped paths */}
          <g stroke="#1A1A1A" strokeWidth="1.5" fill="none">
            <path d="M 200 120 L 200 180 L 480 180 L 480 260" />
            <path d="M 480 120 L 480 180" />
            <path d="M 760 120 L 760 180 L 480 180" strokeDasharray="4 3"/>
            <path d="M 200 340 L 200 400 L 480 400" />
            <path d="M 760 340 L 760 400 L 480 400" strokeDasharray="4 3"/>
            <path d="M 480 520 L 480 580" />
          </g>
        </svg>

        <div className="sch-canvas">
          {/* Row 1 — the 3 intro nodes */}
          <div className="node" style={{gridColumn: '1 / span 4'}}>
            <div className="tag">[A] ABOUT</div>
            <div style={{fontFamily: 'Caveat, cursive', fontSize: 26, lineHeight: 1, marginBottom: 6}}>who is robot</div>
            <div className="tx long"></div>
            <div className="tx long lite"></div>
            <div className="tx med lite"></div>
            <div style={{marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap'}}>
              <span className="pill" style={{fontSize: 9, padding: '1px 6px'}}>senior</span>
              <span className="pill" style={{fontSize: 9, padding: '1px 6px'}}>autonomy</span>
              <span className="pill hl" style={{fontSize: 9, padding: '1px 6px'}}>SU26</span>
            </div>
            <div className="pin r" />
            <div className="pin b" />
          </div>

          <div className="node" style={{gridColumn: '5 / span 4'}}>
            <div className="tag">[G] FEATURED</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
              <div className="img-ph" style={{aspectRatio: '4/3'}}>
                <div className="label">featured.gif</div>
              </div>
              <div>
                <div style={{fontFamily: 'Caveat, cursive', fontSize: 22, lineHeight: 1}}>bipedal walker</div>
                <div className="mono" style={{fontSize: 9, color: 'var(--ink-2)', marginBottom: 6}}>// most recent</div>
                <div className="tx long lite"></div>
                <div className="tx med lite"></div>
                <div className="pill hl" style={{marginTop: 6, fontSize: 9}}>case study ↗</div>
              </div>
            </div>
            <div className="pin l" />
            <div className="pin b" />
          </div>

          <div className="node" style={{gridColumn: '9 / span 4'}}>
            <div className="tag">[E] EXPERIENCE</div>
            <div style={{fontFamily: 'Caveat, cursive', fontSize: 22, lineHeight: 1, marginBottom: 8}}>cv / timeline</div>
            {[
              ['25—', 'research asst — autonomy lab'],
              ['24', 'intern — company X'],
              ['23', 'b.s. mech eng'],
              ['22', 'team lead — club'],
            ].map(([y, t], i) => (
              <div key={i} style={{display: 'grid', gridTemplateColumns: '44px 1fr', fontSize: 11, padding: '3px 0', borderTop: i > 0 ? '1px dashed var(--grid)' : 'none'}}>
                <span className="mono" style={{color: 'var(--ink-2)'}}>{y}</span>
                <span>{t}</span>
              </div>
            ))}
            <div className="pin l" />
            <div className="pin b" />
          </div>

          {/* Row 2 — PROJECTS header node */}
          <div className="node" style={{gridColumn: '1 / span 12', background: 'var(--paper-2)'}}>
            <div className="tag">[B] PROJECTS · 7 NODES</div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div style={{fontFamily: 'Caveat, cursive', fontSize: 28, lineHeight: 1}}>builds & experiments</div>
              <div className="mono" style={{fontSize: 10, display: 'flex', gap: 8}}>
                <span className="pill" style={{padding: '1px 6px', fontSize: 9}}>all (7)</span>
                <span className="pill" style={{padding: '1px 6px', fontSize: 9}}>HW</span>
                <span className="pill" style={{padding: '1px 6px', fontSize: 9}}>CV</span>
                <span className="pill" style={{padding: '1px 6px', fontSize: 9}}>SIM</span>
                <span className="pill" style={{padding: '1px 6px', fontSize: 9}}>ML</span>
              </div>
            </div>
          </div>

          {/* Project nodes grid */}
          {[
            {t: 'bipedal walker v3', tag: 'HW·RL', y: '26'},
            {t: 'slam rover outdoor', tag: 'NAV', y: '25'},
            {t: 'visual-grasp arm', tag: 'CV', y: '25'},
            {t: 'drone swarm sim', tag: 'SIM', y: '25'},
            {t: 'tactile gripper', tag: 'HW', y: '24'},
            {t: 'rl cartpole', tag: 'ML', y: '24'},
            {t: 'delivery rover', tag: 'FULL', y: '23'},
          ].map((p, i) => (
            <div key={i} className="node" style={{gridColumn: `${(i % 4) * 3 + 1} / span 3`, padding: 10}}>
              <div className="tag">[B.{i+1}]</div>
              <div className="img-ph" style={{aspectRatio: '4/3', marginBottom: 8}}>
                <div className="label">{p.t.split(' ').join('_')}.gif</div>
              </div>
              <div style={{fontFamily: 'Caveat, cursive', fontSize: 18, lineHeight: 1}}>{p.t}</div>
              <div className="mono" style={{fontSize: 9, color: 'var(--ink-2)', marginTop: 3}}>{p.tag} · '{p.y}</div>
              <div className="pin t" />
            </div>
          ))}

          {/* Skills */}
          <div className="node" style={{gridColumn: '1 / span 6'}}>
            <div className="tag">[D] SKILLS MATRIX</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, fontSize: 11}}>
              {['lang', 'frameworks', 'hardware'].map(cat => (
                <div key={cat}>
                  <div className="mono" style={{fontSize: 9, color: 'var(--ink-2)', borderBottom: '1px dashed var(--ink-3)', paddingBottom: 2, marginBottom: 4}}>{cat.toUpperCase()}</div>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '2px 0'}}>
                      <span>item {i}</span>
                      <span className="mono" style={{letterSpacing: -1, fontSize: 10}}>{'█'.repeat(6-i)}{'░'.repeat(i-1)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="pin t" />
          </div>

          {/* Research */}
          <div className="node" style={{gridColumn: '7 / span 6'}}>
            <div className="tag">[C] RESEARCH · 3</div>
            {[1,2,3].map(i => (
              <div key={i} style={{padding: '6px 0', borderTop: i > 1 ? '1px dashed var(--grid)' : 'none', fontSize: 11}}>
                <div style={{fontWeight: 600}}>[0{i}] paper_title_placeholder_here</div>
                <div className="mono" style={{color: 'var(--ink-2)', fontSize: 10}}>ICRA 2025 · lead · arxiv ↗ pdf ↓</div>
              </div>
            ))}
            <div className="pin t" />
          </div>

          {/* Videos */}
          <div className="node" style={{gridColumn: '1 / span 12'}}>
            <div className="tag">[F] VIDEOS / DEMOS</div>
            <div className="grid4">
              {[1,2,3,4].map(i => (
                <div key={i} className="img-ph" style={{aspectRatio: '16/10', position: 'relative'}}>
                  <div className="label">demo_{i}.mp4</div>
                  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{width: 32, height: 32, border: '2px solid var(--ink)', borderRadius: '50%', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <div style={{width: 0, height: 0, borderLeft: '8px solid var(--ink)', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', marginLeft: 2}} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pin t" />
          </div>

          {/* Contact block */}
          <div className="node" style={{gridColumn: '4 / span 6', background: 'var(--ink)', color: 'var(--paper)'}}>
            <div className="tag" style={{background: 'var(--ink)', color: 'var(--paper)'}}>[Z] CONTACT</div>
            <div style={{fontFamily: 'Caveat, cursive', fontSize: 28, lineHeight: 1, marginBottom: 6, color: 'var(--paper)'}}>let's build.</div>
            <div className="mono" style={{fontSize: 11}}>robot@placeholder.edu · github · linkedin · +1 ••• ••• ••••</div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.DirSchematic = DirSchematic;
