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
    <div className="flex flex-col items-center  justify-center w-full min-h-screen bg-white  text-gray-800 p-10">
      <div class="flex flex-col flex-grow w-full max-w bg-white shadow-xl rounded-lg overflow-hidden">
        <div class="py-2 px-3 bg-black flex flex-row justify-between items-center">
          <div>
            <h2 class="text-white">Sales - Manager Communication Hub</h2>
          </div>

        </div>
        <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
          <DisplayMessage messages={messages} />
        </div>

        <div class="bg-black p-4 flex">
          <input
            class="flex items-center h-10 w-full rounded px-3 text-sm"
            type="text"
            placeholder="Type your message…"
            value={salesmessage}
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

export default SalesManagerMessaging;