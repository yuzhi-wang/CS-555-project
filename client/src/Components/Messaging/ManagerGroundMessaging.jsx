import React, { useState, useEffect, } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import DisplayMessage from './DisplayMessage';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove ,serverTimestamp, setDoc} from "firebase/firestore"; 
import { db } from "../../firebase";
import {useParams } from 'react-router-dom';

function ManagerGroundMessaging({data}) {
   let projectData = data.projectData
  
   let auth = data.auth
  const [messages, setMessages] = useState([]);
  const [managermessage, setManagerMessage] = useState("");

  function handleNewMessageChange(event) {
    setManagerMessage(event.target.value);
  }
  

  async function handleSendMessage() {
    if (managermessage.trim() !== '') {
        // figure out how to get project id involved
        const messageRef = doc(db, "ManagerGroundMessaging", projectData.installationTicketID);
        const docSnap = await getDoc(messageRef);
        if (docSnap.exists()) {
          await updateDoc(messageRef, {
            Messages: arrayUnion({
                Text: managermessage,
                timestamp: new Date(),
                uid: auth.currentUser.uid,
            })
            });
        } else {
          const data = {
            Messages: [{
                Text: managermessage,
                timestamp: new Date(),
                uid: auth.currentUser.uid,
            }]
          }
          await setDoc(doc(db, "ManagerGroundMessaging", projectData.installationTicketID), data);
      }


      setManagerMessage('');
      // fetch data from firebase
    }
  } 

 

  useEffect(() => {
    async function fetchMessages() {
      console.log('Manager Ground messaging use effect fired')
      if(!projectData.installationTicketID) console.log("did not get data yet in manager ground messaging")
      else{
      const docRef = doc(db, "ManagerGroundMessaging", projectData.installationTicketID);
      
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let {Messages} = docSnap.data()
        setMessages(Messages);
      }
    }
    }
    fetchMessages();
  }, [projectData.installationTicketID]);


  return (
    <div>
      <h2>Manager Ground Team Messages:</h2>
      <DisplayMessage messages={messages}/>
      <div>
        <input type="text" value={managermessage} onChange={handleNewMessageChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ManagerGroundMessaging;