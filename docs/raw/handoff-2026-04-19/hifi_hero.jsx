/* global React */
const { useState, useEffect, useRef } = React;

// ============= SCROLL-LINKED JOINT DIAGRAM =============
function JointDiagram() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY / Math.max(1, window.innerHeight * 2);
      setT(Math.min(1, s));
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const ang = -20 + t * 110;
  const ang2 = 30 - t * 90;

  // Upper arm from pivot (160,160)
  const L1 = 100;
  const L2 = 90;
  const r = a => (a * Math.PI) / 180;
  const x1 = 160 + L1 * Math.cos(r(ang));
  const y1 = 160 + L1 * Math.sin(r(ang));
  const x2 = x1 + L2 * Math.cos(r(ang + ang2));
  const y2 = y1 + L2 * Math.sin(r(ang + ang2));

  return (
    <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
      {/* degree ring */}
      <circle cx="160" cy="160" r="140" fill="none" stroke="#141413" strokeWidth="1" strokeDasharray="1 5" opacity="0.4"/>
      <circle cx="160" cy="160" r="120" fill="none" stroke="#141413" strokeWidth="1" opacity="0.2"/>

      {/* degree tick labels */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(d => {
        const tx = 160 + 148 * Math.cos(r(d));
        const ty = 160 + 148 * Math.sin(r(d));
        return <text key={d} x={tx} y={ty+3} fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" fill="#6F6E68">{d}°</text>;
      })}

      {/* arc showing current angle */}
      <path
        d={`M 160 160 L ${160 + 60 * Math.cos(r(-20))} ${160 + 60 * Math.sin(r(-20))} A 60 60 0 ${(ang - (-20)) > 180 ? 1 : 0} 1 ${160 + 60 * Math.cos(r(ang))} ${160 + 60 * Math.sin(r(ang))} Z`}
        fill="oklch(0.82 0.11 130)" opacity="0.35"
      />

      {/* upper link */}
      <line x1="160" y1="160" x2={x1} y2={y1} stroke="#141413" strokeWidth="5" strokeLinecap="round"/>
      <line x1="160" y1="160" x2={x1} y2={y1} stroke="#F5F1E8" strokeWidth="1.5"/>

      {/* lower link */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#141413" strokeWidth="5" strokeLinecap="round"/>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F5F1E8" strokeWidth="1.5"/>

      {/* joints */}
      <circle cx="160" cy="160" r="14" fill="#F5F1E8" stroke="#141413" strokeWidth="2"/>
      <circle cx="160" cy="160" r="3" fill="#141413"/>

      <circle cx={x1} cy={y1} r="10" fill="#F5F1E8" stroke="#141413" strokeWidth="2"/>
      <circle cx={x1} cy={y1} r="2" fill="#141413"/>

      <circle cx={x2} cy={y2} r="8" fill="oklch(0.82 0.11 130)" stroke="#141413" strokeWidth="2"/>

      {/* readouts */}
      <g fontFamily="JetBrains Mono" fontSize="9" fill="#141413">
        <rect x="4" y="4" width="80" height="18" fill="#F5F1E8" stroke="#141413"/>
        <text x="10" y="16">θ₁={ang.toFixed(1).padStart(6)}°</text>
        <rect x="4" y="24" width="80" height="18" fill="#F5F1E8" stroke="#141413"/>
        <text x="10" y="36">θ₂={ang2.toFixed(1).padStart(6)}°</text>
      </g>
      <g fontFamily="JetBrains Mono" fontSize="9" fill="#6F6E68">
        <text x="316" y="316" textAnchor="end">FIG.01 · 2-DOF ARM</text>
      </g>
    </svg>
  );
}

// ============= HERO =============
function Hero() {
  return (
    <div className="hero">
      <div className="hero-meta">
        <span>◉ portfolio_2026 · v4.2.1</span>
        <span>last push · 2026.04.18 · main</span>
      </div>

      <h1 className="hero-title">
        i build<br/>
        machines that<br/>
        <em>move themselves.</em>
      </h1>

      <div className="hero-bottom">
        <p className="hero-sub">
          <b>Robot</b> — a senior studying robotics, building at the intersection of hardware,
          perception, and reinforcement learning. Currently seeking a <b>Summer 2026</b> internship.
        </p>

        <div className="hero-stats">
          <div className="stat">
            <div className="lbl">// focus</div>
            <div className="val">autonomous<br/>mobility</div>
          </div>
          <div className="stat">
            <div className="lbl">// stack</div>
            <div className="val">ROS2 · Isaac<br/>PyTorch · C++</div>
          </div>
          <div className="stat">
            <div className="lbl">// projects</div>
            <div className="val"><em>07</em> shipped</div>
          </div>
          <div className="stat">
            <div className="lbl">// avail</div>
            <div className="val">Jun <em>26</em> →</div>
          </div>
        </div>

        <div className="hero-joint">
          <JointDiagram/>
        </div>
      </div>
    </div>
  );
}

window.Hero = Hero;
window.JointDiagram = JointDiagram;
