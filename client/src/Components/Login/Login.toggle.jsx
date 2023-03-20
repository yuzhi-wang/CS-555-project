import React, { useState,useEffect } from 'react';

function Toggle(){

    const [btnState,setBtnSatet]= useState (false)

    function handleClick(){
        //
        setBtnSatet(btnState => !btnState)
        console.log(btnState)
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
        <button className=''onClick={handleClick}>Click Me</button>
    )
}

export default Toggle;

