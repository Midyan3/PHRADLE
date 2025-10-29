import React from 'react'
import { darkModeContext } from './App';

export const Footers = () => {
  const darkMode = React.useContext(darkModeContext); 
  return (
    <footer style={{color: darkMode ? 'white' : 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60, borderTop: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.4)', transition: 'all .3 ease'}}>

       <span style={{fontSize: "14px", padding: "10px" , fontWeight: darkMode ? 'normal' : 'bold', letterSpacing: ".75px"}}> &copy; 2025 Phradle. All rights reserved. </span>

    </footer>
  )
}
    
export default Footers;