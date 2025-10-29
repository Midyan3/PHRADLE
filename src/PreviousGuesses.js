// PreviousGuesses.jsx
import ListGuess from './ListGuess';
import React from 'react';
import { darkModeContext } from './App';

export const PreviousGuesses = ({ previousGuesses }) => {

  const darkMode =  React.useContext(darkModeContext);
  const getOrdinal = (n) =>
    ["First","Second","Third","Fourth","Fifth","Sixth"][n-1] ?? `#${n}`;

  return (
    <div style={{}} className='prev-guess-temp'>
      <h2 style={{display:"block", fontSize: 24, color: darkMode ? 'white' : 'black', marginBottom: 10 }}>Previous Guesses</h2>
      <div style={{ width: '100%', height: 1, backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.45)' }} />
       {previousGuesses.length ? (
      <div className="prev-guesses" style={{ display: 'flex', flexWrap: 'wrap', gap: 50, marginBottom: 30, marginTop: 20 }}>
        {previousGuesses.map((row, i) => (
          <div
            key={i}
            className="history-card"
            style={{
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.2)',
              padding: '10px 15px',
              borderRadius: '10px',
              animationDelay: `${i * 200}ms`, 
            }}
          >
            <span style={{ fontSize: 24, color: darkMode ? 'white' : 'black', fontWeight: 500, letterSpacing: 5, transition: 'color 0.3s ease' }}>
              {getOrdinal(i + 1)}
            </span>
            <ListGuess row={row} />
          </div>
        ))}
      </div>
    ) : (<p style={{ color: darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)', fontSize: "18px",  textAlign: 'center' }}>No previous guesses</p>)}
    </div>
  );
};

export default PreviousGuesses;
