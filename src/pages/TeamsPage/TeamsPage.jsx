import { useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import './TeamsPage.css';

export default function TeamsPage({ teams, setTeams, participants }) {
  const [dragState, setDragState]     = useState(null);
  const [dragOverTeam, setDragOverTeam] = useState(null);
  const [renamingTeam, setRenamingTeam] = useState(null);
  const [renameVal, setRenameVal]     = useState('');

  if (!teams || teams.length === 0) {
    return (
      <div className="page">
        <div className="content-wrap teams-empty">
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--outline-variant)' }}>group_work</span>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem' }}>
            No teams generated yet. Go to Dashboard to generate teams.
          </p>
        </div>
      </div>
    );
  }

  const handleDragStart = (e, memberName, fromTeamId) => {
    setDragState({ memberName, fromTeamId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, teamId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTeam(teamId);
  };

  const handleDrop = (e, toTeamId) => {
    e.preventDefault();
    if (!dragState || dragState.fromTeamId === toTeamId) {
      setDragState(null); setDragOverTeam(null); return;
    }
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === dragState.fromTeamId) return { ...t, members: t.members.filter((m) => m !== dragState.memberName) };
        if (t.id === toTeamId)             return { ...t, members: [...t.members, dragState.memberName] };
        return t;
      })
    );
    setDragState(null); setDragOverTeam(null);
  };

  const deleteMember = (memberName, teamId) =>
    setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, members: t.members.filter((m) => m !== memberName) } : t));

  const startRename  = (team) => { setRenamingTeam(team.id); setRenameVal(team.name); };
  const commitRename = (teamId) => {
    if (renameVal.trim()) setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, name: renameVal.trim() } : t));
    setRenamingTeam(null);
  };

  return (
    <div className="page">
      <div className="content-wrap">
        <div className="anim-fade-up" style={{ marginBottom: '2rem' }}>
          <h2 className="font-headline page-headline" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
            Generated <span style={{ color: 'var(--primary)' }}>Teams</span>
          </h2>
          <p style={{ color: 'var(--on-surface-variant)' }}>
            Drag and drop members between teams to finalize. Double-click team name to rename.
          </p>
        </div>

        <div className="h-scroll teams-scroll" style={{ paddingBottom: '1.5rem' }}>
          {teams.map((team, ti) => (
            <div
              key={team.id}
              className={`team-card anim-fade-up ${dragOverTeam === team.id ? 'drag-over' : ''}`}
              style={{ animationDelay: `${ti * 0.07}s` }}
              onDragOver={(e) => handleDragOver(e, team.id)}
              onDragLeave={() => setDragOverTeam(null)}
              onDrop={(e) => handleDrop(e, team.id)}
            >
              {/* Team Header */}
              <div style={{ marginBottom: '1rem' }}>
                {renamingTeam === team.id ? (
                  <input
                    className="rename-input"
                    value={renameVal}
                    onChange={(e) => setRenameVal(e.target.value)}
                    onBlur={() => commitRename(team.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitRename(team.id); if (e.key === 'Escape') setRenamingTeam(null); }}
                    autoFocus
                  />
                ) : (
                  <h3 className="font-headline" onDoubleClick={() => startRename(team)} style={{ fontSize: '1rem', fontWeight: 700, cursor: 'text', marginBottom: '0.25rem' }}>
                    {team.name}
                  </h3>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>{team.members.length} members</span>
                  <span style={{ color: 'var(--outline-variant)' }}>·</span>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, height: '3px', background: 'var(--surface-container-high)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${team.compatibility}%`, background: 'linear-gradient(90deg,var(--secondary),var(--primary))', borderRadius: '999px' }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>{team.compatibility}%</span>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div style={{ minHeight: '80px' }}>
                {team.members.length === 0 && (
                  <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(72,71,80,0.3)', borderRadius: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Drop members here</span>
                  </div>
                )}
                {team.members.map((memberName) => {
                  const p = participants.find((p) => p.name === memberName);
                  const isDragging = dragState?.memberName === memberName && dragState?.fromTeamId === team.id;
                  return (
                    <div
                      key={memberName}
                      className={`member-item ${isDragging ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, memberName, team.id)}
                      onDragEnd={() => { setDragState(null); setDragOverTeam(null); }}
                    >
                      <Avatar name={memberName} size={32} fontSize="0.7rem" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{memberName}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.2rem' }}>
                          {p?.skills.slice(0, 2).map((s) => (
                            <span key={s.id} style={{ fontSize: '0.58rem', padding: '0.1rem 0.35rem', borderRadius: '999px', background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>{s.name}</span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => deleteMember(memberName, team.id)} style={{ background: 'none', border: 'none', color: 'rgba(172,170,181,0.5)', cursor: 'pointer', padding: '0.2rem', borderRadius: '0.5rem', transition: 'color 0.2s', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>delete</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Strength tags */}
              {team.strengths?.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(72,71,80,0.15)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {team.strengths.map((s, i) => (
                      <span key={i} style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', borderRadius: '999px', background: 'var(--surface-container-high)', color: 'var(--tertiary)', fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
