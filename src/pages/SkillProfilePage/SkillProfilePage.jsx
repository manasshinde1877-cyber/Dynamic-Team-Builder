import { useState, useMemo, useRef } from 'react';
import { SKILL_SUGGESTIONS, MASTERY_LABELS } from '../../constants';
import { getMasteryLabel, getMasteryColor } from '../../utils';
import './SkillProfilePage.css';

export default function SkillProfilePage({ onComplete }) {
  const [userName, setUserName]   = useState('');
  const [inputVal, setInputVal]   = useState('');
  const [skills, setSkills]       = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef();

  const filteredSuggestions = useMemo(() => {
    if (!inputVal.trim()) return SKILL_SUGGESTIONS.slice(0, 8);
    return SKILL_SUGGESTIONS.filter(
      (s) => s.toLowerCase().includes(inputVal.toLowerCase()) && !skills.find((sk) => sk.name === s)
    );
  }, [inputVal, skills]);

  const addSkill = (name) => {
    const trimmed = (name || inputVal).trim();
    if (!trimmed) return;
    if (skills.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    setSkills((prev) => [...prev, { id: Date.now(), name: trimmed, level: 50 }]);
    setInputVal('');
    setShowSuggestions(false);
  };

  const removeSkill  = (id)      => setSkills((prev) => prev.filter((s) => s.id !== id));
  const updateLevel  = (id, val) => setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, level: parseInt(val) } : s)));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addSkill(inputVal);
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  const canComplete = userName.trim() && skills.length >= 1;

  return (
    <div className="page">
      <div className="content-wrap">
        <div className="profile-grid">

          {/* ── Left panel ── */}
          <div className="anim-left profile-sticky">
            <div style={{ marginBottom: '1rem' }}>
              <span className="chip" style={{ color: 'var(--tertiary)', border: '1px solid rgba(169,151,255,0.2)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>auto_awesome</span>
                Step 02 of 04
              </span>
            </div>

            <h1 className="font-headline hero-headline" style={{ fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Map your <br />
              <span style={{ background: 'linear-gradient(135deg,var(--primary),var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Intelligence.
              </span>
            </h1>

            <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, maxWidth: '380px', marginBottom: '2.5rem' }}>
              Define your core strengths and mastery. Each skill you add shapes your Aura profile — powering the algorithm that builds optimal, balanced teams.
            </p>

            {/* Step dots */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2.5rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  width: i === 2 ? '24px' : '8px', height: '8px', borderRadius: '999px',
                  background: i === 2 ? 'var(--primary)' : i < 2 ? 'var(--secondary)' : 'var(--outline-variant)',
                  transition: 'all 0.3s',
                }} />
              ))}
              <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginLeft: '0.5rem' }}>Skill Mapping</span>
            </div>

            {/* Decorative panel */}
            <div className="glass" style={{ borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid rgba(72,71,80,0.15)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right, rgba(216,145,255,0.08), transparent 60%)' }} />
              <div style={{ position: 'relative' }}>
                <p className="section-title" style={{ marginBottom: '1rem' }}>why skills matter</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { icon: 'hub',      text: 'Neural matching across 12+ skill dimensions' },
                    { icon: 'balance',  text: 'Constraint-aware team balancing algorithm' },
                    { icon: 'insights', text: 'Real-time compatibility scoring' },
                  ].map(({ icon, text }) => (
                    <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)', fontSize: '1.1rem' }}>{icon}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="anim-right glass profile-form-card" style={{ borderRadius: '2rem', border: '1px solid rgba(72,71,80,0.12)' }}>

            {/* Name */}
            <div style={{ marginBottom: '2rem' }}>
              <p className="section-title" style={{ marginBottom: '0.75rem' }}>Your Name</p>
              <input
                className="input-field"
                style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '1rem', fontSize: '1rem' }}
                placeholder="Enter your full name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {/* Skill Search */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p className="section-title" style={{ marginBottom: '0.75rem' }}>Primary Expertise</p>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)', fontSize: '1.2rem', pointerEvents: 'none' }}>search</span>
                <input
                  ref={inputRef}
                  className="input-field"
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', fontSize: '0.95rem' }}
                  placeholder="Add a skill (e.g. React, UX, Python...)"
                  value={inputVal}
                  onChange={(e) => { setInputVal(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onKeyDown={handleKeyDown}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="suggestions">
                    {filteredSuggestions.slice(0, 6).map((s) => (
                      <div key={s} className="suggestion-item" onMouseDown={() => addSkill(s)}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)', fontSize: '1rem' }}>add_circle</span>
                        <span style={{ fontSize: '0.875rem' }}>{s}</span>
                      </div>
                    ))}
                    {inputVal.trim() && !SKILL_SUGGESTIONS.find((s) => s.toLowerCase() === inputVal.toLowerCase().trim()) && (
                      <div className="suggestion-item" onMouseDown={() => addSkill(inputVal)} style={{ borderTop: '1px solid rgba(72,71,80,0.2)' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '1rem' }}>add</span>
                        <span style={{ fontSize: '0.875rem' }}>Add "<strong>{inputVal}</strong>"</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Skills List */}
            {skills.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <p className="section-title" style={{ marginBottom: '1rem' }}>Added Skills ({skills.length})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {skills.map((skill, idx) => (
                    <div key={skill.id} className="skill-card anim-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '3px', height: '24px', borderRadius: '999px', background: 'linear-gradient(to bottom, var(--primary), var(--secondary))' }} />
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{skill.name}</span>
                        </div>
                        <button onClick={() => removeSkill(skill.id)} style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', padding: '0.25rem', borderRadius: '0.5rem', transition: 'color 0.2s' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>close</span>
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>Mastery Level</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: getMasteryColor(skill.level) }}>{getMasteryLabel(skill.level)}</span>
                      </div>
                      <input type="range" min="0" max="100" value={skill.level} onChange={(e) => updateLevel(skill.id, e.target.value)} />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', marginTop: '0.4rem' }}>
                        {MASTERY_LABELS.map((l, i) => (
                          <span key={l} style={{ fontSize: '0.6rem', color: 'rgba(172,170,181,0.5)', textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem', opacity: 0.4 }}>psychology</span>
                <p style={{ fontSize: '0.875rem' }}>Add skills to build your intelligence profile</p>
              </div>
            )}

            <button
              className="btn-primary"
              disabled={!canComplete}
              onClick={() => onComplete({ name: userName.trim(), skills })}
              style={{ width: '100%', padding: '1.1rem', borderRadius: '1.25rem', fontSize: '1rem', letterSpacing: '0.03em' }}
            >
              {skills.length === 0 ? 'Add at least one skill' : `Complete Profile → ${skills.length} skill${skills.length > 1 ? 's' : ''} added`}
            </button>
            <button style={{ width: '100%', padding: '0.75rem', background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '0.875rem', marginTop: '0.5rem', fontFamily: 'Manrope,sans-serif' }}>
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
