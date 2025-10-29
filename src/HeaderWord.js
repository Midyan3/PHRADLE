export const HeaderWord = ({ title = "Wordle", setDarkMode, setHelp, darkMode = true }) => {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "10px 12px"
        }}
      >
        <div style={{display: "flex", flexDirection: "column", alignContent: "center", gap: 10, color: "white", marginTop: "4px", marginLeft: "4px" }}>
          
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className="switch"
          />
          <span style={{paddingLeft: `${3 + 6}px`, marginTop: "-7px",  fontSize: 12, userSelect: "none", fontFamily: "Arial", letterSpacing: "1px", color: `${darkMode ? "white" : "black"}`, transition: "color .8s ease" }}>{darkMode ? "Dark" : "Light"}</span>
        </div>

        <h1
          style={{
            color: darkMode ? "white" : "black",
            fontSize: "48px",
            fontWeight: "bold",
            fontFamily: "Roboto, sans-serif",
            textTransform: "uppercase",
            textShadow: "2px 2px 4px rgba(255, 255, 255, 0.2)",
            letterSpacing: "10px",
            margin: 0,
            padding: "3px 0 10px 0",
            justifySelf: "center"
          }}
        >
          {title}
        </h1>
        <div style={{ justifySelf: "end", display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setHelp(prev => !prev)}
            aria-label="Help"
            style={{ backgroundColor: "transparent", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          >
            <span
              className="help-span" 
              style={{
                "--help-span-hover-bg" : darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.5)",
                color: darkMode ? "white" : "black",
                padding: "5px",
                height: 42,
                width: 42,
                display: "flex",
                justifyContent: "center",
                borderLeft: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.2)",
                borderBottom: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.2)",
                alignItems: "center",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: 27,
                lineHeight: 1
              }}
            >
              ?
            </span>
          </button>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "2px",
          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.6)",
          transition: "background-color 0.3s ease",
          display: "block"
        }}
      />
    </>
  );
};

export default HeaderWord;
