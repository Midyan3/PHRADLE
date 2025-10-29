import React from 'react';
import { darkModeContext } from './App';

export const ListGuess = ({ row }) => {
  const cells = Array.isArray(row[0]) ? row.flat() : row;
  const darkMode = React.useContext(darkModeContext);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 50px)',
        gridAutoRows: '50px',
        gap: 10,
        marginBottom: 10,
      }}
    >
      {cells.map((letter, i) => (
        <div
          key={i}
          className={`box ${letter?.status ? letter.status: ''}`}
          style={{
            width: 50,
            height: 50,
            border: darkMode ? 'none' : '1px solid rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '--staggers': '500ms',
            borderRadius: 8,
       
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              opacity: darkMode ? 0.7 : 0.9,
              color: darkMode ? 'white' : 'black',
              lineHeight: 1,
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
          >
            {typeof letter === 'object' ? (letter.status === "missing") ? '?' : (letter.char ?? letter.letter ?? '') : (letter ?? '')}
          </span>
        </div>
      ))}
    </div>
  );
};
export default ListGuess;
