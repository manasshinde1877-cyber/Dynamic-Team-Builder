import './ApiSetupModal.css';

export default function ApiSetupModal({ groqKey, setGroqKey, hfKey, setHfKey, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="font-headline" style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Configuration</h3>
          <button onClick={onClose} className="modal-close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Info box */}
        <div className="modal-info-box">
          <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)', fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>info</span>
          <div style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--on-surface)', display: 'block', marginBottom: '0.25rem' }}>How it works</strong>
            Groq (recommended) is free, fast, and works perfectly in browsers. HuggingFace key is pre-filled. If both fail, a{' '}
            <strong style={{ color: 'var(--tertiary)' }}>local smart algorithm</strong> runs automatically — no API needed.
          </div>
        </div>

        {/* Groq Key */}
        <div className="modal-field">
          <div className="modal-field__header">
            <label className="modal-field__label">
              Groq API Key <span style={{ color: 'var(--secondary)' }}>★ Recommended</span>
            </label>
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="modal-field__link">
              Get free key →
            </a>
          </div>
          <input
            className="input-field modal-field__input"
            placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
            value={groqKey}
            onChange={(e) => setGroqKey(e.target.value)}
          />
          {groqKey && !groqKey.startsWith('gsk_') && (
            <p className="modal-field__hint modal-field__hint--error">Groq keys start with "gsk_"</p>
          )}
          {groqKey.startsWith('gsk_') && (
            <p className="modal-field__hint modal-field__hint--success">✓ Valid Groq key format</p>
          )}
        </div>

        {/* HF Key */}
        <div className="modal-field">
          <div className="modal-field__header">
            <label className="modal-field__label">
              HuggingFace Token <span style={{ color: 'var(--on-surface-variant)', fontWeight: 400 }}>(fallback)</span>
            </label>
          </div>
          <input
            className="input-field modal-field__input"
            placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxx"
            value={hfKey}
            onChange={(e) => setHfKey(e.target.value)}
          />
          <p className="modal-field__hint">Note: HuggingFace free tier may have CORS limitations in browsers.</p>
        </div>

        {/* No key notice */}
        <div className="modal-no-key-box">
          <p style={{ fontSize: '0.78rem', color: 'var(--tertiary)', fontWeight: 600, marginBottom: '0.35rem' }}>No key? No problem.</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
            The built-in local algorithm uses a constraint-satisfaction snake-draft to form balanced teams — it works offline, instantly, with no API.
          </p>
        </div>

        <button className="btn-primary" onClick={onClose} style={{ width: '100%', padding: '0.875rem', borderRadius: '1rem', fontSize: '0.9rem' }}>
          Save &amp; Close
        </button>
      </div>
    </div>
  );
}
