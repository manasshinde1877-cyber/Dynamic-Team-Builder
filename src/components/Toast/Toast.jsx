import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, icon, onClose, visible }) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onClose, 4500);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="toast toast--enter">
      <span className="material-symbols-outlined toast__icon">{icon || 'info'}</span>
      <span className="toast__message">{message}</span>
      <button onClick={onClose} className="toast__close">
        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
      </button>
    </div>
  );
}
