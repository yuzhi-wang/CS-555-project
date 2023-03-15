import React, { useState , useEffect} from 'react';

function DisplayMessage({messages}) {


    return (
      <div>     
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message.Text} - {message.uid}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default DisplayMessage;