import React, { useState } from 'react';

function Toggle(){

    const [btnState,setBtnSatet]= useState (false)

    function handleClick(){
        //
        setBtnSatet(btnState => !btnState)
    }
    return(
        <button className=''onClick={handleClick}>Toggle</button>
    )
}

export default Toggle;

