import { useEffect, useState, useMemo } from 'react';

function nextUTCMidnight() {
  const now = new Date();
  const utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
  return utc;
}

export default function useNextResetTimer() {
  const target = useMemo(() => nextUTCMidnight(), []);
  const [ms, setMs] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const t = setInterval(() => {
      setMs(prev => {
        const next = target - Date.now();
        return next > 0 ? next : 0;
      });
    }, 250);
    return () => clearInterval(t);
  }, [target]);

  const total = Math.max(0, ms);
  const hours = Math.floor(total / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1000);

  return { hours, minutes, seconds, msRemaining: total };
}
