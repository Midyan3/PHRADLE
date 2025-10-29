export const Modal = ({help, setHelp}) => {
  return (
    <div className={`modal-help-backdrop ${help ? "open" : ""}`} style={{zIndex: help ? 1000 : -1}} >
      <div className="modal-help-info" style={{"--background-color-modal": "rgba(255, 255, 255, 0.6)"}}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", height: "100%"}}> 
          <div style={{borderBottom: "2px solid rgba(24, 23, 23, 1)"}}> 
            <h2 style={{display: "block", margin: "10px", fontSize: "30px"}}>How to Play</h2>
          </div>

          <div style={{marginTop: "20px", textAlign: "center", padding: "10px"}}> 
            <p>Guess the <strong>PHRADLE</strong> in 6 tries.</p>
            <p>Each phrase has <strong>up to 5 words</strong>, and each word contains <strong>1–5 letters</strong>.</p>
            <p>After each guess, tiles change color to show how close you are to the phrase. Colors are evaluated <strong>per word (row)</strong>:</p>
            <div>
              <strong>Coloring rules:</strong>
              <div style={{marginTop: "10px", textAlign: "left"}}>
                <p>
                  <span className='correct' style={{backgroundColor: "green", color: "white", padding: "2px 6px", borderRadius: "4px"}}>Green</span>
                  &nbsp;The letter is in <strong>this word</strong> and in the <strong>correct position</strong>.
                </p>
                <p>
                  <span style={{backgroundColor: "gold", color: "black", padding: "2px 6px", borderRadius: "4px"}}>Yellow</span>
                  &nbsp;The letter is in <strong>this word</strong> but in the <strong>wrong position</strong>.
                </p>
                <p>
                  <span style={{backgroundColor: "red", color: "white", padding: "2px 6px", borderRadius: "4px"}}>Red</span>
                  &nbsp;The letter is <strong>not in this word</strong> (it might still appear in a <strong>different word</strong> of the phrase).
                </p>
                <p>
                  <span style={{backgroundColor: "gray", color: "white", padding: "2px 6px", borderRadius: "4px"}}>Gray</span>
                  &nbsp;This cell is <strong>outside this word&rsquo;s length</strong> (the word is shorter here). It does <strong>not</strong> indicate whether the letter exists in the word.
                </p>
                <p>
                  <span style={{backgroundColor: "rgb(90, 90, 180)", color: "white", padding: "2px 6px", borderRadius: "4px"}}>?</span>
                  &nbsp;Bluish/purplish <strong>?</strong> means the position is <strong>unfilled</strong>—you’re missing a letter here in your current guess.
                </p>
              </div>
            </div>
            <h3>Other Technical Details</h3>
              <p>Punctuation is ignored in all phrases. For example, "DON'T" is treated as "DONT", so punctuation can be omitted when guessing.</p>
              <p>To submit a guess, type your letters and press Enter until you’ve completed the final word in the phrase.</p>
              <p>Moving onto the next word (row) can be done by pressing Space or Enter after finishing a word.</p>
              <p>Backspace deletes the last letter in your current guess. Pressing Enter on rows 1–4 automatically moves you to the next row.</p>

            <p style={{marginTop: "12px"}}><em>Note:</em> Colors are determined separately for each row (word).</p>
          </div>
        </div>
        <div style={{display: "flex", justifyContent: "center", unset: "all", marginBottom: "20px"}}>
            <button className='help-close-button' onClick={() => setHelp((prev) => !prev)}>Say No More</button>
        </div>
      </div>
    </div>
  )
}

export default Modal;
