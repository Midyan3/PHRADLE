import React from 'react';
import useNextResetTimer from './useNextResetTimer';

export default function NextResetCountdown() {
  const { hours, minutes, seconds } = useNextResetTimer();

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div style={{
      marginTop: 8,
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,.15)',
      background: 'rgba(0,0,0,.15)'
    }}>
      <div style={{fontWeight:700, marginBottom:4}}>Next puzzle in</div>
      <div style={{fontFamily:'monospace', fontSize:18}}>
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </div>
    </div>
  );
}
