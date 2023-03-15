import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import DisplayMessage from './DisplayMessage';
import { doc, getDoc  } from "firebase/firestore"; 
import { db } from "../../firebase";

function SalesMessaging() {
    const auth = getAuth();
    
  const [messages, setMessages] = useState([]);

  function handleNewMessageChange(event) {
    /*
    setNewMessage(event.target.value);
    */
  }
  let text = "test"

  function handleSendMessage() {
    /*
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
    */
  } 
  useEffect(() => {
    async function fetchMessages() {
      const docRef = doc(db, "CustomerSalesMessaging", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let {Messages} = docSnap.data()
        setMessages(Messages);
      }
    }
    fetchMessages();
  }, [auth.currentUser.uid]);


  return (
    <div>
      <h2>Messages:</h2>
      <DisplayMessage messages={messages}/>
      <div>
        <input type="text" value={text} onChange={handleNewMessageChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default SalesMessaging;