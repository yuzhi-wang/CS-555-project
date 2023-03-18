import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import DisplayMessage from './DisplayMessage';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove ,serverTimestamp, setDoc,collection, addDoc} from "firebase/firestore"; 
import { db } from "../../firebase";

function CustomerMessaging() {
    const auth = getAuth();
    
  const [messages, setMessages] = useState([]);
  const [customermessages, setCustomerMessages] = useState("");


 

  function handleNewMessageChange(event) {
    
    setCustomerMessages(event.target.value);
    
  }
  

  async function handleSendMessage() {
  
    if (customermessages.trim() !== '') {
      // send data to firebase
      const messageRef = doc(db, "CustomerSalesMessaging", auth.currentUser.uid);
      console.log(messageRef)
      const docSnap = await getDoc(messageRef);
      if (docSnap.exists()) {
        await updateDoc(messageRef, {
          Messages: arrayUnion({
            Text: customermessages,
            role: "customer",
            timestamp: new Date(),
            uid: auth.currentUser.uid,
          })
          });
      } else {
        const data = {
          name: auth.currentUser.displayName,
          salesteamassigned: "Get random ID from sales database",
          Messages: [{
            Text: customermessages,
            role: "customer",
            timestamp: new Date(),
            uid: auth.currentUser.uid,
          }]
        }
        await setDoc(doc(db, "CustomerSalesMessaging", auth.currentUser.uid), data);
    }
      
      


      setCustomerMessages('');
      // fetch data from firebase
    }
   
  }
  
  

  useEffect(() => {
    async function fetchMessages() {
      console.log("customer use effect")
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
        <input type="text" value={customermessages} onChange={handleNewMessageChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      
    </div>
  );
}

export default CustomerMessaging;


