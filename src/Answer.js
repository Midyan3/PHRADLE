import React, { useEffect, useRef, useState } from 'react';
import NextResetCountdown from './NextResetCountdown';
import { darkModeContext } from './App';

export default function Answer({ open, data, onClose }) {
  const [isMounted, setIsMounted] = useState(open);
  const [phase, setPhase] = useState(open ? 'enter' : 'idle');
  const closeBtnRef = useRef(null);
  const darkMode = React.useContext(darkModeContext);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      requestAnimationFrame(() => setPhase('enter'));
    } else if (isMounted) {
      setPhase('exit');
      const t = setTimeout(() => {
        setIsMounted(false);
        setPhase('idle');
      }, 180);
      return () => clearTimeout(t);
    }
  }, [open, isMounted]);

  useEffect(() => {
    if (open && closeBtnRef.current) closeBtnRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!isMounted) return null;

  const dailyInfo = data?.dailyInfo ?? {};
  const rawGrid = data?.dailyPhrase?.grid;

  const rows = Math.max(
    5,
    Array.isArray(rawGrid) ? rawGrid.length : 0
  );
  const cols = Math.max(
    5,
    Array.isArray(rawGrid) ? Math.max(0, ...rawGrid.map(r => (Array.isArray(r) ? r.length : 0))) : 0
  );

  const safeGrid = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (__, j) =>
      Array.isArray(rawGrid) && Array.isArray(rawGrid[i]) && rawGrid[i][j] != null ? rawGrid[i][j] : ''
    )
  );

  const { genre = '—', sourceTitle = '—', character = '—', year = '—', description } = dailyInfo;

  return (
    <div
      className={`modal-help-backdrop open help ${phase === 'enter' ? 'is-entering' : ''} ${phase === 'exit' ? 'is-exiting' : ''}`}
      style={{ display: 'block' }}
      aria-hidden={!open}
    >
      <div
        className={`modal-help-info help ${phase === 'enter' ? 'is-entering' : ''} ${phase === 'exit' ? 'is-exiting' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Answer"
        style={{ background: darkMode ? 'rgb(30,30,30)' : 'white', color: darkMode ? 'white' : 'black' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ margin: '4px 0' }}>Today’s Answer</h2>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 50px)`, gridAutoRows: '50px', gap: 10 }}>
            {safeGrid.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black' }}
                  >
                    {cell || '\u00A0'}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div style={{ fontSize: 14, opacity: .8 }}>
            <div><strong>Genre:</strong> {genre}</div>
            <div><strong>Title/Source:</strong> {sourceTitle}</div>
            <div><strong>Character/Person:</strong> {character}</div>
            <div><strong>Year:</strong> {year}</div>
          </div>

          {description ? (
            <p style={{ marginTop: 8, lineHeight: 1.5 }}>{description}</p>
          ) : (
            <p style={{ marginTop: 8, opacity: .7 }}>No description available.</p>
          )}

          <NextResetCountdown />

          <button ref={closeBtnRef} className="help-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
