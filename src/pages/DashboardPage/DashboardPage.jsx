import { useState, useMemo } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import SkillPieChart from '../../components/charts/SkillPieChart';
import './DashboardPage.css';

export default function DashboardPage({ participants, onGenerateTeams, isGenerating }) {
  const [teamSize, setTeamSize] = useState(4);

  const totalSkills = participants.reduce((s, p) => s + p.skills.length, 0);
  const avgSkills   = (totalSkills / participants.length).toFixed(1);

  const topSkill = useMemo(() => {
    const counts = {};
    participants.forEach((p) => p.skills.forEach((s) => { counts[s.name] = (counts[s.name] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  }, [participants]);

  const numTeams = Math.ceil(participants.length / teamSize);

  return (
    <div className="page">
      <div className="content-wrap">

        {/* Heading */}
        <div className="anim-fade-up" style={{ marginBottom: '2.5rem' }}>
          <h2 className="font-headline page-headline" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
            Overview <span style={{ color: 'var(--primary)' }}>Dashboard</span>
          </h2>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            Real-time insights across {participants.length} registered participants
          </p>
        </div>

        {/* Stat Cards */}
        <div className="stat-cards-row" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Total Participants', value: participants.length,                                                                                     icon: 'group',     color: 'var(--primary)' },
            { label: 'Unique Skills',      value: new Set(participants.flatMap((p) => p.skills.map((s) => s.name))).size,                                   icon: 'psychology',color: 'var(--secondary)' },
            { label: 'Avg Skills / Person',value: avgSkills,                                                                                               icon: 'bar_chart', color: 'var(--tertiary)' },
            { label: 'Most Common Skill',  value: topSkill,                                                                                                icon: 'star',      color: 'var(--primary-container)', small: true },
          ].map(({ label, value, icon, color, small }, i) => (
            <div key={label} className="stat-card anim-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="material-symbols-outlined" style={{ color, fontSize: '1.1rem' }}>{icon}</span>
                <span className="section-title">{label}</span>
              </div>
              <div className="font-headline" style={{ fontSize: small ? '1rem' : '2rem', fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="dashboard-main-grid">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Participants list */}
            <div className="glass" style={{ borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(72,71,80,0.12)' }}>
              <p className="section-title" style={{ marginBottom: '1.25rem' }}>Participants</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '360px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {participants.map((p, i) => (
                  <div key={p.id} className="anim-fade-up" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: 'var(--surface-container)', borderRadius: '1rem', animationDelay: `${i * 0.04}s` }}>
                    <Avatar name={p.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{p.name}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {p.skills.slice(0, 4).map((s) => (
                          <span key={s.id} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>{s.name}</span>
                        ))}
                        {p.skills.length > 4 && <span style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)' }}>+{p.skills.length - 4}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>
                      {p.skills.length} skill{p.skills.length > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Generator */}
            <div className="glass glow-primary" style={{ borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(216,145,255,0.15)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top left,rgba(216,145,255,0.06),transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <p className="section-title" style={{ marginBottom: '1.25rem' }}>Generate Teams</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>Team Size</span>
                      <span className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{teamSize} members</span>
                    </div>
                    <input type="range" min="2" max="8" value={teamSize} onChange={(e) => setTeamSize(+e.target.value)} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(172,170,181,0.5)' }}>2</span>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(172,170,181,0.5)' }}>8</span>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem 1.25rem', background: 'var(--surface-container)', borderRadius: '1rem', textAlign: 'center', minWidth: '100px' }}>
                    <div className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>{numTeams}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Teams</div>
                  </div>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => onGenerateTeams(teamSize)}
                  disabled={isGenerating}
                  style={{ width: '100%', padding: '1rem', borderRadius: '1.25rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner" style={{ width: '18px', height: '18px' }} />
                      Generating with AI
                      <span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>auto_awesome</span>
                      Auto-Generate Teams
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Pie Chart */}
          <div className="glass" style={{ borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(72,71,80,0.12)' }}>
            <p className="section-title" style={{ marginBottom: '1.5rem' }}>Skill Distribution</p>
            <SkillPieChart participants={participants} />
          </div>
        </div>
      </div>
    </div>
  );
}
