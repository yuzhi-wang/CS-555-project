import React, { useState, useEffect, } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import DisplayMessage from './DisplayMessage';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove ,serverTimestamp} from "firebase/firestore"; 
import { db } from "../../firebase";
import {useParams } from 'react-router-dom';


function SalesMessaging() {
    const auth = getAuth();
    const params = useParams();
    
  const [messages, setMessages] = useState([]);
  const [salesmessage, setSalesMessage] = useState("");

  function handleNewMessageChange(event) {
    setSalesMessage(event.target.value);
  }
  

  async function handleSendMessage() {
    if (salesmessage.trim() !== '') {
      // send data to firebase
      const messageRef = doc(db, "CustomerSalesMessaging", params.id);

      
      await updateDoc(messageRef, {
      Messages: arrayUnion({
        Text: salesmessage,
        role: "sales",
        timestamp: new Date(),
        uid: auth.currentUser.uid,
      })
      });
      


      setSalesMessage('');
      // fetch data from firebase
    }
  } 
  useEffect(() => {
    async function fetchMessages() {
      console.log('Sales messaging use effect fired')
      const docRef = doc(db, "CustomerSalesMessaging", params.id);
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
      <h2>Sales Messages:</h2>
      <DisplayMessage messages={messages}/>
      <div>
        <input type="text" value={salesmessage} onChange={handleNewMessageChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default SalesMessaging;