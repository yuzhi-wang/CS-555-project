import React, { useState,useEffect } from 'react';
import './Login.toggle.styles.css'
function Toggle(){

    const [btnState,setBtnSatet]= useState (false)

    function handleClick(event){
        event.preventDefault()
        setBtnSatet(btnState => !btnState)
       
    }
    useEffect(() => {
        let element = document.getElementById('main');
        if (element) {
          if (btnState) {
            element.classList.add('sign_up_mode');
          } else {
            element.classList.remove('sign_up_mode');
          }
        }
      }, [btnState]);
    return(
        
        <button type='button' className='clickme' onClick={handleClick}>Click Me</button>
    )
}

export default Toggle;

