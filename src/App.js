import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import HeaderWord from './HeaderWord';
import { MainPlay } from './MainPlay';
import Hint from './Hint';
import PreviousGuesses from './PreviousGuesses';
import Answer from './Answer';
import Footers from './Footers';
import HelpModal from './HelpModal';
import Modal from './Modal';

export const darkModeContext = React.createContext(null);

const STORAGE = {
  currentWord: 'currentWord',
  colorGrid: 'colorGrid',
  prevGuesses: 'previousGuesses',
  guessesSoFar: 'guessesSoFar',
  gotIt: 'gotIt',
  lastPlayedUtc: 'lastPlayedUtc',
};

const safeParse = (raw, fallback) => {
  try {
    if (raw == null) return fallback;
    const val = JSON.parse(raw);
    return val === undefined ? fallback : val;
  } catch {
    return fallback;
  }
};

const todayUtcKey = () => {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const App = () => {
  const attempts = 5;
  const maxWordSize = 5;

  const makeGrid = (rows = attempts, cols = maxWordSize) =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));

  if (typeof window !== 'undefined') {
    const last = localStorage.getItem(STORAGE.lastPlayedUtc);
    const today = todayUtcKey();
    if (last !== today) {
      localStorage.removeItem(STORAGE.currentWord);
      localStorage.removeItem(STORAGE.colorGrid);
      localStorage.removeItem(STORAGE.prevGuesses);
      localStorage.removeItem(STORAGE.guessesSoFar);
      localStorage.removeItem(STORAGE.gotIt);
      localStorage.setItem(STORAGE.lastPlayedUtc, today);
    }
  }

  const [currentWord, setCurrentWord] = React.useState(() => {
    const fallback = [['T', 'y', 'p', 'e', ''], ['t', 'o', '', '', ''], ['g', 'u', 'e', 's', 's'], ['', '', '', '', ''], ['', '', '', '', '']];
    return typeof window === 'undefined'
      ? fallback
      : safeParse(localStorage.getItem(STORAGE.currentWord), fallback);
  });

  const [colorGrid, setColorGrid] = React.useState(() => {
    return typeof window === 'undefined'
      ? makeGrid(attempts, maxWordSize)
      : safeParse(localStorage.getItem(STORAGE.colorGrid), makeGrid(attempts, maxWordSize));
  });

  const [stagger, setStagger] = React.useState('staggered');
  const [inputEnabled, setInputEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const [help, setHelp] = React.useState(false);
  const [genreHint, setGenreHint] = React.useState('');
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [answerObject, setAnswerObject] = React.useState(null);

  const start = useRef(true);
  const dup = useRef(false);
  const guess = useRef('');
  const rowInd = useRef(0);

  const readGotIt = () => {
    const parsed = safeParse(
      typeof window === 'undefined' ? null : localStorage.getItem(STORAGE.gotIt),
      false
    );
    return typeof parsed === 'boolean' ? parsed : false;
  };

  const [gotIt, setGotIt] = React.useState(readGotIt());
  const [showHintForGot, setShowHintForGot] = React.useState(gotIt);

  const [guessesSoFar, setGuessesSoFar] = React.useState(() => {
    return typeof window === 'undefined'
      ? 0
      : safeParse(localStorage.getItem(STORAGE.guessesSoFar), 0);
  });

  const API_URL = useMemo(() => 'https://phradle-server.onrender.com/', []);
  const [previousGuesses, setPreviousGuesses] = React.useState(() => {
    return typeof window === 'undefined'
      ? []
      : safeParse(localStorage.getItem(STORAGE.prevGuesses), []);
  });

  const calcRevealMs = useCallback((grid) => {
    const perRow = 150;
    let maxDelay = 0;
    grid.forEach((row, rowIndex) => {
      const activeCells = row.filter((cell) => cell !== 'disabled').length;
      maxDelay = Math.max(maxDelay, perRow * (rowIndex + 1) * activeCells);
    });
    return maxDelay;
  }, []);

  const obj = function() {
    return this;
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const topElem = document.elementFromPoint?.(0, 0);
    if (darkMode) {
      root.style.setProperty('--background-color', 'rgba(36, 36, 36, 1)');
      if (topElem) {
        topElem.style.setProperty('--highlight-background-color', 'rgba(244, 244, 244, 0.8)');
        topElem.style.setProperty('--highlight-text-color', '#000000');
      }
    } else {
      root.style.setProperty('--background-color', 'rgba(255, 255, 255, 0.72)');
      if (topElem) {
        topElem.style.setProperty('--highlight-background-color', 'rgba(24, 23, 23, 1)');
        topElem.style.setProperty('--highlight-text-color', '#FFFFFF');
      }
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE.prevGuesses, JSON.stringify(previousGuesses));
    localStorage.setItem(STORAGE.guessesSoFar, JSON.stringify(guessesSoFar));
    if (gotIt === false) {
      localStorage.setItem(STORAGE.currentWord, JSON.stringify(currentWord));
    }
    localStorage.setItem(STORAGE.colorGrid, JSON.stringify(colorGrid));
    localStorage.setItem(STORAGE.gotIt, JSON.stringify(gotIt));
    localStorage.setItem(STORAGE.lastPlayedUtc, todayUtcKey());
  }, [previousGuesses, guessesSoFar, currentWord, colorGrid, gotIt]);

  // Fetch helpers
  const GetGenreHint = useCallback(async () => {
    try {
      const req = await fetch(`${API_URL}graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query { dailyInfo { genre } }`,
        }),
      });
      if (!req.ok) return '';
      const data = await req.json();
      if (!data || data.errors) return '';
      return data.data?.dailyInfo?.genre ?? '';
    } catch {
      return '';
    }
  }, [API_URL]);

  const FetchAnswerObject = useCallback(async () => {
    try {
      const req = await fetch(`${API_URL}graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              dailyInfo { sourceTitle description character year genre }
              dailyPhrase { grid }
            }`,
        }),
      });
      if (!req.ok) return {};
      const data = await req.json();
      if (data.errors || !data.data || !data.data.dailyInfo) return {};
      return data.data;
    } catch {
      return {};
    }
  }, [API_URL]);

  const shownAnswerRef = useRef(false);
  useEffect(() => {
    const finished =
      gotIt ||
      (guessesSoFar >= 6 && !shownAnswerRef.current) ||
      colorGrid.every((row, r) =>
        row.every((cell, c) => (cell === 'disabled' && !currentWord[r][c]) || cell === 'correct')
      );

    if (!finished || shownAnswerRef.current) return;

    shownAnswerRef.current = true;
    setGotIt(true);
    setShowHintForGot(true);
    setShowAnswer(true);

    if (!answerObject || !answerObject.dailyInfo) {
      FetchAnswerObject().then(setAnswerObject);
    }
  }, [gotIt, guessesSoFar, colorGrid, currentWord, answerObject, FetchAnswerObject]);

  const createDeepCopy = (array) => array.map((row) => row.slice());

  const CheckGuess = useCallback(async () => {
    if (
      previousGuesses.length &&
      previousGuesses.some((g) =>
        g.every((row, j) => row.every((cell, k) => cell.letter === currentWord[j][k]))
      )
    ) {
      dup.current = true;
      return;
    }
    dup.current = false;

    let next = makeGrid(attempts, maxWordSize);

    try {
      const res = await fetch(`${API_URL}check/check-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: currentWord, row: attempts, col: maxWordSize }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) next = data;
      }
    } catch {

    }

    const revealMs = calcRevealMs(next);
    setColorGrid(next);

    const copy = createDeepCopy(currentWord);
    for (let col = 0; col < maxWordSize; col++) {
      for (let row = 0; row < attempts; row++) {
        copy[row][col] = { letter: currentWord[row][col], status: next[row][col] };
      }
    }

    setGuessesSoFar((prev) => {
      const newCount = prev + 1;
      if (newCount === 3) {
        GetGenreHint().then((hint) => setGenreHint(hint));
      }
      return newCount;
    });
    setPreviousGuesses((prev) => [...prev, copy]);

    setStagger('staggered');
    setInputEnabled(false);
    setTimeout(() => setInputEnabled(true), revealMs || 0);
  }, [
    API_URL,
    attempts,
    maxWordSize,
    currentWord,
    previousGuesses,
    calcRevealMs,
    GetGenreHint,
  ]);

  useEffect(() => {
    const keyDown = (event) => {
      if (!inputEnabled || showAnswer) return;

      const key = event.key;

      if (start.current) {
        setCurrentWord(makeGrid(attempts, maxWordSize));
        start.current = false;
      }

      if (event.code === 'Backspace') {
        setStagger('unstaggered');

        if (guess.current.length === 0) {
          if (rowInd.current === 0) return;
          rowInd.current -= 1;
          guess.current = currentWord[rowInd.current].join('');
          setColorGrid((prevGrid) => {
            const next = prevGrid.map((r) => r.slice());
            for (let col = 0; col < maxWordSize; col++) {
              const rowAhead = Math.min(rowInd.current + 1, attempts - 1);
              if (next[rowInd.current][col] === 'missing') next[rowInd.current][col] = 'empty';
              if (next[rowAhead][col] === 'missing') next[rowAhead][col] = 'empty';
            }
            return next;
          });
        }

        setColorGrid((prevGrid) => {
          const next = prevGrid.map((r) => r.slice());
          const col = Math.min(guess.current.length, maxWordSize - 1);
          next[rowInd.current][col] = 'empty';
          return next;
        });

        setCurrentWord((prevWord) => {
          const next = prevWord.map((r) => r.slice());
          const col = guess.current.length - 1;
          if (col >= 0) next[rowInd.current][col] = '';
          guess.current = guess.current.slice(0, -1);
          return next;
        });

        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        rowInd.current = Math.min(rowInd.current + 1, attempts - 1);
        guess.current = currentWord[rowInd.current].join('');
        setCurrentWord((prevWord) => prevWord.map((r) => r.slice()));
        return;
      }

      if (key === 'Enter') {
        if (gotIt || guessesSoFar >= 6) {
          setShowAnswer(true);
          return;
        }
        CheckGuess();
        if (dup.current) return;
        return;
      }

      if (/^[a-z]$/i.test(key)) {
        if (guess.current.length >= maxWordSize) {
          if (rowInd.current >= attempts - 1) return;
          rowInd.current = Math.min(rowInd.current + 1, attempts - 1);
          guess.current = '';
        }
        setStagger('unstaggered');
        const size = guess.current.length;
        setCurrentWord((prevWordArray) => {
          const next = prevWordArray.map((r) => r.slice());
          const col = guess.current.length;
          next[rowInd.current][col] = key.toUpperCase();
          guess.current += key.toUpperCase();
          return next;
        });

        setColorGrid((prevGrid) => {
          const next = prevGrid.map((r) => r.slice());
          const col = Math.min(size, maxWordSize - 1);
          next[rowInd.current][col] = 'empty';
          return next;
        });
      }
    };

    window.addEventListener('keydown', keyDown);
    return () => window.removeEventListener('keydown', keyDown);
  }, [attempts, maxWordSize, currentWord, inputEnabled, CheckGuess, showAnswer, guessesSoFar, gotIt]);

  useEffect(() => {
    setShowHintForGot(gotIt);
  }, [gotIt]);

  return (
    <>
      <darkModeContext.Provider value={darkMode}>
        <HelpModal />
        <HeaderWord
          title="Phradle"
          setDarkMode={setDarkMode}
          darkMode={darkMode}
          setHelp={setHelp}
        />
        <div className="App">
          <Modal help={help} setHelp={setHelp} />
          <Hint genreHint={genreHint} guessesSoFar={guessesSoFar} showHintForGot={showHintForGot} />
          <Answer open={showAnswer} data={answerObject} onClose={() => setShowAnswer(false)} />
          <MainPlay
            currentWord={currentWord}
            colorGrid={colorGrid}
            rowInd={rowInd}
            guess={guess}
            stagger={stagger}
            inputEnabled={inputEnabled}
          />
          <PreviousGuesses previousGuesses={previousGuesses} />
          <Footers />
        </div>
      </darkModeContext.Provider>
    </>
  );
};

export default App;
