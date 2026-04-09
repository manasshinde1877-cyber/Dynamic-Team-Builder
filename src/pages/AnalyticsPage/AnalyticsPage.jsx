import { useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import RadarChart from '../../components/charts/RadarChart';
import './AnalyticsPage.css';

export default function AnalyticsPage({ teams, participants }) {
  const [selectedTeam, setSelectedTeam] = useState(0);

  if (!teams || teams.length === 0) {
    return (
      <div className="page">
        <div className="content-wrap analytics-empty">
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--outline-variant)' }}>analytics</span>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem' }}>Generate teams first to see analytics</p>
        </div>
      </div>
    );
  }

  const team = teams[selectedTeam];

  return (
    <div className="page">
      <div className="content-wrap">

        {/* Heading */}
        <div className="anim-fade-up" style={{ marginBottom: '2rem' }}>
          <h2 className="font-headline page-headline" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
            Team <span style={{ color: 'var(--primary)' }}>Analytics</span>
          </h2>
          <p style={{ color: 'var(--on-surface-variant)' }}>Deep-dive performance insights for each generated team</p>
        </div>

        {/* Team Selector */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {teams.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setSelectedTeam(i)}
              className="analytics-team-btn"
              style={{
                background: i === selectedTeam ? 'linear-gradient(135deg,var(--primary),var(--primary-container))' : 'var(--surface-container)',
                color: i === selectedTeam ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                boxShadow: i === selectedTeam ? '0 4px 20px rgba(216,145,255,0.3)' : 'none',
              }}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Analytics Grid */}
        <div className="analytics-grid">

          {/* Radar */}
          <div className="glass anim-fade-up" style={{ borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(72,71,80,0.12)' }}>
            <p className="section-title" style={{ marginBottom: '1.25rem' }}>Team Dimensions</p>
            <div className="radar-wrap">
              <RadarChart key={team.id} aspects={team.aspects} teamName={team.name} />
            </div>
          </div>

          {/* Scores + Aspects + Strengths */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Scores */}
            <div className="glass anim-fade-up" style={{ borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(72,71,80,0.12)', animationDelay: '0.1s' }}>
              <p className="section-title" style={{ marginBottom: '1.25rem' }}>Team Scores</p>
              {[
                { label: 'Compatibility', value: team.compatibility, color: 'var(--secondary)' },
                { label: 'Stability',     value: team.stability,     color: 'var(--tertiary)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>{label}</span>
                    <span className="font-headline" style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{value}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Aspect Bars */}
            <div className="glass anim-fade-up" style={{ borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(72,71,80,0.12)', animationDelay: '0.15s' }}>
              <p className="section-title" style={{ marginBottom: '1.25rem' }}>Performance Aspects</p>
              {Object.entries(team.aspects || {}).map(([key, val]) => (
                <div key={key} style={{ marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)' }}>{key}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--on-surface)', fontFamily: 'Space Grotesk' }}>{val}</span>
                  </div>
                  <div className="progress-bar" style={{ height: '3px' }}>
                    <div className="progress-fill" style={{ width: `${val}%`, background: 'linear-gradient(90deg,var(--tertiary),var(--primary))' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Core Strengths */}
            <div className="glass anim-fade-up" style={{ borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(72,71,80,0.12)', animationDelay: '0.2s' }}>
              <p className="section-title" style={{ marginBottom: '1rem' }}>Core Strengths</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {(team.strengths || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.875rem', background: 'var(--surface-container)', borderRadius: '0.75rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Members breakdown */}
        <div className="glass anim-fade-up" style={{ marginTop: '1.5rem', borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(72,71,80,0.12)' }}>
          <p className="section-title" style={{ marginBottom: '1.25rem' }}>
            Team Members — {team.name} ({team.members?.length || 0})
          </p>
          <div className="analytics-members-wrap">
            {(team.members || []).map((memberName) => {
              const p = participants.find((p) => p.name === memberName);
              return (
                <div key={memberName} className="analytics-member-card">
                  <Avatar name={memberName} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{memberName}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
                      {p?.skills.slice(0, 3).map((s) => (
                        <span key={s.id} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>{s.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
