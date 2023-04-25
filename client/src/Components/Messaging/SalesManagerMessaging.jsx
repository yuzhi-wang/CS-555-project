import React, { useState, useEffect, } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import DisplayMessage from './DisplayMessage';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove ,serverTimestamp, setDoc} from "firebase/firestore"; 
import { db } from "../../firebase";
import {useParams, useNavigate } from 'react-router-dom';

function SalesManagerMessaging({data}) {
   let projectData = data.projectData
   let auth = data.auth
  const [messages, setMessages] = useState([]);
  const [salesmessage, setSalesMessage] = useState("");
  const navigate = useNavigate();
  function handleNewMessageChange(event) {
    setSalesMessage(event.target.value);
  }
  

  async function handleSendMessage() {
    if (salesmessage.trim() !== '') {
        // figure out how to get project id involved
        const messageRef = doc(db, "SalesManagerMessaging", projectData.projectID);
        const docSnap = await getDoc(messageRef);
        if (docSnap.exists()) {
          await updateDoc(messageRef, {
            Messages: arrayUnion({
                Text: salesmessage,
                timestamp: new Date(),
                uid: auth.currentUser.uid,
            })
            });
        } else {
          const data = {
            Messages: [{
                Text: salesmessage,
                timestamp: new Date(),
                uid: auth.currentUser.uid,
            }]
          }
          await setDoc(doc(db, "SalesManagerMessaging", projectData.projectID), data);
      }


      setSalesMessage('');
      navigate(0)
      // fetch data from firebase
    }
  } 

 

  useEffect(() => {
    async function fetchMessages() {
      console.log('Sales Manager messaging use effect fired')
      const docRef = doc(db, "SalesManagerMessaging", projectData.projectID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let {Messages} = docSnap.data()
        setMessages(Messages);
      }
    }
    fetchMessages();
  }, [projectData]);


  return (
    <div>
      <h2>Sales - Manager Messages:</h2>
      <DisplayMessage messages={messages}/>
      <div>
        <input type="text" value={salesmessage} onChange={handleNewMessageChange} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default SalesManagerMessaging;