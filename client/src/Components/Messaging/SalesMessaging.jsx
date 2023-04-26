import React, { useState, useEffect, } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import DisplayMessage from './DisplayMessage';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove ,serverTimestamp} from "firebase/firestore"; 
import { db } from "../../firebase";
import {useParams } from 'react-router-dom';
import { onSnapshot } from "firebase/firestore";

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
    const docRef = doc(db, "CustomerSalesMessaging", params.id);
  
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        let { Messages } = docSnap.data();
        setMessages(Messages);
      }
    });
  
    return () => {
      // Clean up the listener when the component is unmounted
      unsubscribe();
    };
  }, [auth.currentUser.uid, params.id]); // Add params.id as a dependency


  
  return (
    <div className="flex flex-col items-center  justify-center w-full min-h-screen bg-white  text-gray-800 p-10">
      <div class="flex flex-col flex-grow w-full max-w bg-white shadow-xl rounded-lg overflow-hidden">
        <div class="py-2 px-3 bg-black flex flex-row justify-between items-center">
          <div>
            <h2 class="text-white">Messages</h2>
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

export default SalesMessaging;