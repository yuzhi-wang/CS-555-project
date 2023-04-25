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
    <div className="flex flex-col items-center  justify-center w-full min-h-screen bg-white  text-gray-800 p-10">
      <div class="flex flex-col flex-grow w-full max-w bg-white shadow-xl rounded-lg overflow-hidden">
        <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
          <DisplayMessage messages={messages} />
        </div>

        <div class="bg-gray-300 p-4 flex">
          <input
            class="flex items-center h-10 w-full rounded px-3 text-sm"
            type="text"
            placeholder="Type your message…"
            value={managermessage}
            onChange={handleNewMessageChange}
          />
          <button
            class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagerGroundMessaging;