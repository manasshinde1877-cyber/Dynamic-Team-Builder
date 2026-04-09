import { useState } from 'react';
import { generateTeams, DEFAULT_HF_KEY, DEFAULT_GROQ_KEY } from './services/teamGeneration';

import Nav            from './components/Nav/Nav';
import Toast          from './components/Toast/Toast';

import SkillProfilePage from './pages/SkillProfilePage/SkillProfilePage';
import DashboardPage    from './pages/DashboardPage/DashboardPage';
import TeamsPage        from './pages/TeamsPage/TeamsPage';
import AnalyticsPage    from './pages/AnalyticsPage/AnalyticsPage';
import LandingPage      from './pages/LandingPage/LandingPage';

import './pages/DashboardPage/DashboardPage.css';
import './pages/TeamsPage/TeamsPage.css';
import './pages/AnalyticsPage/AnalyticsPage.css';

export default function App() {
  const [activeTab,    setActiveTab]    = useState('landing');
  const [participants, setParticipants] = useState([]);
  const [teams,        setTeams]        = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast,        setToast]        = useState({ visible: false, message: '', icon: '' });
  const [groqKey,      setGroqKey]      = useState(DEFAULT_GROQ_KEY);
  const [hfKey,        setHfKey]        = useState(DEFAULT_HF_KEY);

  const showToast = (message, icon = 'check_circle') =>
    setToast({ visible: true, message, icon });

  // ── Profile complete → add participant ──────────────────────────────────────
  const handleProfileComplete = (userData) => {
    setParticipants((prev) => [...prev, { id: Date.now(), ...userData }]);
    showToast(`${userData.name} added! Add more participants or proceed to Dashboard.`, 'person_add');
  };

  // ── Generate teams ──────────────────────────────────────────────────────────
  const handleGenerateTeams = async (teamSize) => {
    if (participants.length < 2) {
      showToast('Add at least 2 participants first.', 'warning');
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateTeams(participants, teamSize, groqKey, hfKey);
      if (!result?.teams) throw new Error('Invalid AI response structure');
      setTeams(result.teams);
      const source = groqKey?.trim().startsWith('gsk_')
        ? 'Groq AI'
        : hfKey?.trim().startsWith('hf_')
        ? 'HuggingFace AI'
        : 'Local Algorithm';
      showToast(`Teams generated via ${source}! Open "Teams" tab to see them.`, 'auto_awesome');
    } catch (e) {
      console.error(e);
      showToast('AI generation failed: ' + e.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Landing Page */}
      {activeTab === 'landing' ? (
        <LandingPage onLaunch={() => setActiveTab('profile')} />
      ) : (
        <>
          {/* Navigation */}
          <Nav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            teams={teams}
            participants={participants}
            groqKey={groqKey}
            onAddMember={() => setActiveTab('profile')}
          />

          {/* Pages */}
          {activeTab === 'profile'   && <SkillProfilePage key={participants.length} onComplete={handleProfileComplete} />}
          {activeTab === 'dashboard' && (
            <DashboardPage
              participants={participants}
              onGenerateTeams={handleGenerateTeams}
              isGenerating={isGenerating}
            />
          )}
          {activeTab === 'teams'     && <TeamsPage teams={teams} setTeams={setTeams} participants={participants} />}
          {activeTab === 'analytics' && <AnalyticsPage teams={teams} participants={participants} />}
        </>
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        icon={toast.icon}
        visible={toast.visible}
        onClose={() => setToast((p) => ({ ...p, visible: false }))}
      />

      {/* Background ambient glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(216,145,255,0.04) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(255,104,168,0.03) 0%,transparent 70%)' }} />
      </div>
    </>
  );
}
