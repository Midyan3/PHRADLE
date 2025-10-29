## Copilot instructions for this repository

Purpose: Help AI coding agents be productive immediately in this small Create React App project (a daily phrase/word-guessing UI called "Phradle"). Keep suggestions concrete and refer to files below.

Key files and responsibilities
- `src/App.js` — single largest file: main stateful orchestrator. Holds the game state, keyboard handling, fetch logic, and functions like `CheckGuess`, `GetGenreHint`, and GraphQL `dailyInfo` fetch. Prefer changes here for game rules or API adjustments.
- `src/MainPlay.js` — presentational grid renderer. Reads `currentWord`, `colorGrid`, `rowInd`, and `guess` refs from `App` and renders tiles with CSS classes like `missing`, `filled`, `correct`.
- `src/index.js` — app bootstrap (standard CRA). Use `npm start` to run dev server (port 3000 by default).
- `src/*.js` — smaller components: `HeaderWord.js`, `Hint.js`, `PreviousGuesses.js`, `Answer.js`, `NextResetCountdown.js`, `HelpModal.js`, `Modal.js`, `Footers.js`. Use them for UI-only changes.

Big-picture architecture and data flow
- Single-page React app (Create React App + `react-scripts`). `App` holds most logic and orchestrates communication with a backend API.
- Two main in-memory grids:
  - `currentWord` — 2D array of letters (rows = attempts, cols = word length). Cells are strings (letters) or empty strings.
  - `colorGrid` — 2D array of status codes used for rendering (examples seen in code: `'empty'`, `'missing'`, `'correct'`, `'disabled'`). `MainPlay` maps these to CSS classes.
- User input path: keyboard events (attached in `App` via `window.addEventListener('keydown')`) update `currentWord` and `colorGrid`; pressing Enter triggers `CheckGuess` which POSTs to backend and updates `colorGrid` and `previousGuesses`.

Backend integration & environment
- API base: `API_URL` is computed in `App.js` as `process.env.VITE_API_URL || 'http://localhost:8000/'`.
- GraphQL endpoint: `POST ${API_URL}graphql` (see the fetch in `App.js` requesting `dailyInfo` and `dailyPhrase`).
- Guess checking endpoint: `POST ${API_URL}check/check-answer` (CheckGuess sends JSON `{ guess, row, col }` and expects a 2D status array back).
- Local dev requires a backend that implements `/graphql` and `/check/check-answer` as described. If you only run the frontend, the app will log fetch errors and fall back to local behavior.

Developer workflows & commands
- Run dev server: `npm start` (CRA default — opens http://localhost:3000).
- Build for production: `npm run build`.
- Run tests: `npm test` (CRA test runner).
- Environment variable (Windows PowerShell example for a single session):
  - `$env:VITE_API_URL = 'http://localhost:8000/'` then `npm start`.

Project-specific conventions & patterns
- Logic centralization: put game rules, fetch logic, and keyboard handling in `App.js` rather than scattering state across components. UI components are mostly presentational.
- Data shapes: always treat `currentWord` and `colorGrid` as rectangular matrices (rows x cols). Use `makeGrid(rows, cols)` pattern from `App.js` when creating new grids.
- Refs used for transient mutable values: `guess`, `rowInd`, `gotIt`, `start` — prefer refs for cursor-like mutable state and React state for values that affect render.
- Styling & theme: dark mode toggles CSS variables at the document root (`--background-color`, `--highlight-background-color`, etc.) in `App.js`. Components read `data-theme` or use `darkModeContext` to switch render variants.

Where to look for common edits/bugs
- Keyboard handling and row/col cursor logic in `App.js` (the large `useEffect` attaching `keydown`). Off-by-one and ref synchronization bugs usually originate here.
- Network errors: `CheckGuess` and GraphQL fetches log errors to the console; if backend responses change shape, update parsing of `data` in `App.js`.
- Animation delays and reveal timing: `calcRevealMs` in `App.js` controls reveal timing; edit when changing stagger behavior.

Examples (copy-pasteable snippets to reference behavior)
- GraphQL query (in `App.js`):
  - Request body contains query for `dailyInfo { sourceTitle description character year genre }` and `dailyPhrase { grid }`.
- Guess check POST: `fetch(`${API_URL}check/check-answer`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ guess: currentWord, row: attempts, col: maxWordSize }) })`

Edit guidance
- Small UI tweaks: change `MainPlay.js` or CSS classes. Keep `App.js` API/logic intact unless modifying rules.
- New API fields: update both the fetch parsing and the `Answer`/`Hint` components which consume `dailyInfo`.

If anything in this instruction is unclear or you want me to include more examples (e.g., common refactors, tests to add, or a minimal mock backend), tell me which area to expand.
