import './Nav.css';

export default function Nav({ activeTab, setActiveTab, teams, participants, groqKey, onAddMember }) {
  const tabs = [
    { id: 'profile',   label: 'Profile',   icon: 'person' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'teams',     label: 'Teams',     icon: 'group_work' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  ];

  return (
    <nav className="nav-inner">
      <div className="logo">Aura</div>

      <div className="nav-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`nav-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
            {t.id === 'teams' && teams.length > 0 && (
              <span className="nav-tab__badge">{teams.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="nav-right">
        <span className="nav-participant-count">
          {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </span>
        <button onClick={onAddMember} className="nav-btn">
          <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>add</span>
          <span className="nav-btn__label">Add</span>
        </button>
      </div>
    </nav>
  );
}
