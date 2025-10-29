import React from 'react';
import { darkModeContext } from './App';

export const MainPlay = ({ currentWord, colorGrid, rowInd, guess, stagger, inputEnabled, start }) => {
  const darkMode = React.useContext(darkModeContext);

  const cellStyle = {
    width: 140,
    height: 140,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 50,
    fontWeight: 700,
    color: 'var(--tile-text)',
    textTransform: 'uppercase',
  };

  return (
    <main data-theme={darkMode ? 'dark' : 'light'}>
      <div style={{ display:'flex', justifyContent:'center', marginTop:30, height:'fit-content',
                    pointerEvents: inputEnabled ? 'auto' : 'none', userSelect:'none' }}>
        {currentWord?.length ? (
          <div style={{ display:'flex', flexDirection:'column', gap:30, padding:60, borderRadius:20 }}>
            {currentWord.map((row, rowIndex) => {
              const delay = stagger === 'staggered' ? (rowIndex + 1) * 150 : 40;
              return (
                <div key={rowIndex} style={{ display:'flex', gap:18 }}>
                  {row.map((letter, colIndex) => {
                    const state = colorGrid?.[rowIndex]?.[colIndex];
                    const isCursor = rowIndex === rowInd.current && colIndex === Math.min(guess.current.length, 5);
                    const isMissing = state === 'missing';
                    return (
                      <div
                        key={colIndex}
                        className={`guessbox ${letter ? 'filled' : ''} ${state || ''}`}
                        style={{ '--stagger': `${delay === 40 ? delay : delay * (colIndex + 1)}ms` }}
                      >
                        {letter ? (
                          <span style={cellStyle}>{letter}</span>
                        ) : isMissing ? (
                          <span className="qmark" style={cellStyle}>?</span>
                        ) : (
                          <span style={cellStyle}>{isCursor ? '_' : ''}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          <h2 style={{ color: 'var(--tile-text)' }}>Start Typing to Play</h2>
        )}
      </div>

    </main>
  );
};
