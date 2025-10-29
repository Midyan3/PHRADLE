import React from 'react'
import { darkModeContext } from './App';

export const Hint = ({genreHint, guessesSoFar, showHintForGot}) => {
  console.log("showHintForGot in Hint:", showHintForGot);
  const darkMode = React.useContext(darkModeContext); 
    return (
    <div>
      <div style={{marginTop: "10px", textAlign: "center"}}>
        {<p style={{opacity: (!showHintForGot && guessesSoFar >=3 ) ? 1 : 0, color: darkMode ? '#FFFFFF' : '#000000', fontSize: "18px", fontWeight: "bold", transition: 'opacity 0.3s ease'}} >Genre Hint: {genreHint}</p>}
        <div>
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{opacity: guessesSoFar ? 1 : 0, display: 'inline-block', margin: '0 5px', height: '30px', width: '30px', border: `1px solid ${darkMode ? '#FFFFFF' : '#000000'}`, borderRadius: "4px", backgroundColor: guessesSoFar > i ? (darkMode ? '#FFFFFF' : '#000000') : 'transparent', transition: 'all 0.3s ease'}}>

                </div> 
            ))} 
        </div>

      </div>
    </div>
  )
}

export default Hint;