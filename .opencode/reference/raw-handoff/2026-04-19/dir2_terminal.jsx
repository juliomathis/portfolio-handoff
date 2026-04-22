/* global React */

// ============================================
// DIRECTION 2: Terminal / System Dashboard
// ============================================
function DirTerminal() {
  return (
    <div className="term">
      {/* Sidebar */}
      <div className="term-side">
        <div className="term-brand">
          <span className="sig">Robot</span>
          <div style={{fontSize: 9, color: 'var(--ink-2)'}}>robotics · senior</div>
          <div style={{borderTop: '1px dashed var(--ink)', marginTop: 6, paddingTop: 6, fontSize: 9}}>
            sys status: <span style={{background: 'var(--highlight)', padding: '0 4px'}}>ONLINE</span>
          </div>
        </div>

        <div className="term-nav-section">
          <div className="lbl">// NAV</div>
          <a className="on">about</a>
          <a>projects</a>
          <a>research</a>
          <a>skills</a>
          <a>experience</a>
          <a>videos</a>
        </div>

        <div className="term-nav-section">
          <div className="lbl">// FILTER</div>
          <a>hardware (3)</a>
          <a>perception (2)</a>
          <a>sim (1)</a>
          <a>ml (1)</a>
        </div>

        <div className="term-nav-section">
          <div className="lbl">// LINKS</div>
          <a>github ↗</a>
          <a>linkedin ↗</a>
          <a>cv.pdf ↓</a>
          <a>email →</a>
        </div>

        <div style={{position: 'absolute', bottom: 14, left: 14, right: 14, fontSize: 9, color: 'var(--ink-3)', borderTop: '1px dashed var(--ink-3)', paddingTop: 8}}>
          last compile:<br/>2026.04.18 · 09:42
        </div>
      </div>

      {/* Main */}
      <div className="term-main">
        <div className="term-prompt">
          <span style={{color: 'var(--ink)'}}>robot@portfolio:~$</span> cat about.md<span className="caret">▊</span>
        </div>

        {/* HERO ABOUT */}
        <div className="term-card">
          <div className="term-card-head">
            <span>◉ about.md</span>
            <span>~/home</span>
          </div>
          <div className="term-card-body">
            <div style={{fontFamily: 'Caveat, cursive', fontSize: 42, lineHeight: 1, marginBottom: 8}}>
              i teach machines to move.
            </div>
            <div className="tx long"></div>
            <div className="tx long"></div>
            <div className="tx med"></div>
            <div style={{marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, fontSize: 11}}>
              {[
                {k: 'focus', v: 'autonomous mobility'},
                {k: 'lang', v: 'C++, Py, Rust'},
                {k: 'stack', v: 'ROS2, Isaac'},
                {k: 'avail', v: 'Jun 2026 →'},
              ].map((x, i) => (
                <div key={i} style={{border: '1px dashed var(--ink)', padding: 8}}>
                  <div style={{color: 'var(--ink-3)', fontSize: 9}}>[{x.k}]</div>
                  <div>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="term-prompt" style={{marginTop: 20}}>
          <span style={{color: 'var(--ink)'}}>$</span> ls -la projects/
        </div>

        {/* PROJECTS TABLE */}
        <div className="term-card">
          <div className="term-card-head">
            <span>◉ projects/ — 7 items</span>
            <span>[sort: recent ▾]</span>
          </div>
          <div className="term-card-body" style={{padding: 0}}>
            <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 11}}>
              <thead>
                <tr style={{borderBottom: '1.5px solid var(--ink)', background: 'var(--paper-2)'}}>
                  {['#', 'name', 'type', 'stack', 'year', 'media'].map(h => (
                    <th key={h} style={{padding: '6px 10px', textAlign: 'left', color: 'var(--ink-2)', fontWeight: 500}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['01', 'bipedal-walker-v3', 'HW+RL', 'Isaac,PyTorch', '26', 'vid,cad'],
                  ['02', 'slam-rover-outdoor', 'NAV', 'ROS2,C++', '25', 'vid,plot'],
                  ['03', 'arm-visual-grasp', 'CV', 'Py,CUDA', '25', 'vid,img'],
                  ['04', 'swarm-sim', 'SIM', 'Isaac,Py', '25', 'vid'],
                  ['05', 'tactile-gripper', 'HW', 'CAD,FW', '24', 'cad,img'],
                  ['06', 'rl-cartpole', 'ML', 'PyTorch', '24', 'plot'],
                  ['07', 'campus-delivery-bot', 'FULL', 'all', '23', 'vid,img'],
                ].map((r, i) => (
                  <tr key={i} style={{borderBottom: '1px dashed var(--grid)', cursor: 'pointer'}}>
                    {r.map((c, j) => (
                      <td key={j} style={{padding: '8px 10px'}}>
                        {j === 1 ? <span style={{borderBottom: '1px dashed var(--ink)'}}>{c}</span> : c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EXPANDED PROJECT PREVIEW */}
        <div className="term-card">
          <div className="term-card-head">
            <span>◉ projects/01_bipedal-walker-v3/README.md</span>
            <span>[expanded ▾]</span>
          </div>
          <div className="term-card-body">
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
              <div>
                <div style={{fontFamily: 'Caveat, cursive', fontSize: 26, lineHeight: 1, marginBottom: 6}}>bipedal walker v3</div>
                <div className="mono" style={{color: 'var(--ink-2)', marginBottom: 10, fontSize: 10}}>// RL-trained locomotion on custom hardware</div>
                <div className="tx long"></div>
                <div className="tx long"></div>
                <div className="tx med"></div>
                <div style={{marginTop: 12, fontSize: 10}}>
                  <div>▸ role: lead</div>
                  <div>▸ team: 3</div>
                  <div>▸ outcome: walked 42m unassisted</div>
                </div>
              </div>
              <div className="img-ph" style={{aspectRatio: '4/3'}}>
                <div className="label">walker.mp4</div>
              </div>
            </div>
          </div>
        </div>

        <div className="term-prompt" style={{marginTop: 20}}>
          <span style={{color: 'var(--ink)'}}>$</span> cat skills.json
        </div>

        {/* SKILLS */}
        <div className="term-card">
          <div className="term-card-head">
            <span>◉ skills.json</span>
            <span>36 entries</span>
          </div>
          <div className="term-card-body">
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12}}>
              {[
                {t: 'lang', items: [['C++','████████'], ['Python','██████████'], ['Rust','█████'], ['MATLAB','███████']]},
                {t: 'frameworks', items: [['ROS2','█████████'], ['PyTorch','████████'], ['Isaac','██████'], ['OpenCV','███████']]},
                {t: 'hardware', items: [['SolidWorks','████████'], ['Arduino','██████████'], ['PCB design','██████'], ['sensors','████████']]},
              ].map((g, i) => (
                <div key={i}>
                  <div style={{color: 'var(--ink-2)', fontSize: 10, marginBottom: 6, borderBottom: '1px dashed var(--ink-3)', paddingBottom: 3}}>
                    &quot;{g.t}&quot;: [
                  </div>
                  {g.items.map(([n, bar], j) => (
                    <div key={j} style={{display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '2px 0'}}>
                      <span>{n}</span>
                      <span style={{color: 'var(--ink)', letterSpacing: -1}}>{bar}</span>
                    </div>
                  ))}
                  <div style={{color: 'var(--ink-2)', fontSize: 10}}>]</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="term-prompt" style={{marginTop: 20}}>
          <span style={{color: 'var(--ink)'}}>$</span> ls research/ experience/ videos/
        </div>

        {/* RESEARCH + EXPERIENCE row */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14}}>
          <div className="term-card">
            <div className="term-card-head">
              <span>◉ research/</span>
              <span>3</span>
            </div>
            <div className="term-card-body" style={{fontSize: 11}}>
              {[1,2,3].map(i => (
                <div key={i} style={{padding: '6px 0', borderTop: i > 1 ? '1px dashed var(--ink-3)' : 'none'}}>
                  <div>[0{i}] paper_title_placeholder.pdf</div>
                  <div style={{color: 'var(--ink-2)', fontSize: 10}}>ICRA 2025 · 1st author</div>
                </div>
              ))}
            </div>
          </div>
          <div className="term-card">
            <div className="term-card-head">
              <span>◉ experience/</span>
              <span>4</span>
            </div>
            <div className="term-card-body" style={{fontSize: 11}}>
              {[
                ['2025—', 'research-assistant'],
                ['2024', 'robotics-intern'],
                ['2023', 'b.s. mech eng'],
                ['2022', 'robotics-club-lead'],
              ].map(([y, t], i) => (
                <div key={i} style={{display: 'flex', gap: 10, padding: '6px 0', borderTop: i > 0 ? '1px dashed var(--ink-3)' : 'none'}}>
                  <span style={{width: 50, color: 'var(--ink-2)'}}>{y}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIDEOS */}
        <div className="term-card" style={{marginTop: 14}}>
          <div className="term-card-head">
            <span>◉ videos/ — feed</span>
            <span>[▶ autoplay muted]</span>
          </div>
          <div className="term-card-body">
            <div className="grid3">
              {[1,2,3].map(i => (
                <div key={i} className="img-ph" style={{aspectRatio: '16/10'}}>
                  <div className="label">clip_{i}.mp4</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="term-prompt" style={{marginTop: 20}}>
          <span style={{color: 'var(--ink)'}}>$</span> echo &quot;thanks for scrolling&quot; | mail -s recruiter robot@placeholder.edu<span className="caret">▊</span>
        </div>
      </div>
    </div>
  );
}

window.DirTerminal = DirTerminal;
