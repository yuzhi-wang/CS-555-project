import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import DisplayMessage from "./DisplayMessage";
import {
  doc,
  getDoc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  serverTimestamp,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { onSnapshot } from "firebase/firestore";

function CustomerMessaging() {
  const auth = getAuth();

  const [messages, setMessages] = useState([]);
  const [customermessages, setCustomerMessages] = useState("");

  function handleNewMessageChange(event) {
    setCustomerMessages(event.target.value);
  }

  async function handleSendMessage() {
    if (customermessages.trim() !== "") {
      // insert code to get random sales member for now default displayed to all

      // send data to firebase
      const messageRef = doc(
        db,
        "CustomerSalesMessaging",
        auth.currentUser.uid
      );

      const docSnap = await getDoc(messageRef);
      if (docSnap.exists()) {
        await updateDoc(messageRef, {
          Messages: arrayUnion({
            Text: customermessages,
            role: "customer",
            timestamp: new Date(),
            uid: auth.currentUser.uid,
          }),
        });
      } else {
        const data = {
          name: auth.currentUser.displayName,
          salesteamassigned: "Get random ID from sales database",
          Messages: [
            {
              Text: customermessages,
              role: "customer",
              timestamp: new Date(),
              uid: auth.currentUser.uid,
            },
          ],
        };
        await setDoc(
          doc(db, "CustomerSalesMessaging", auth.currentUser.uid),
          data
        );
      }

      setCustomerMessages("");
      // fetch data from firebase
    }
  }

  useEffect(() => {
    const docRef = doc(db, "CustomerSalesMessaging", auth.currentUser.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        let { Messages } = docSnap.data();
        setMessages(Messages);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth.currentUser.uid]);


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
            value={customermessages}
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

export default CustomerMessaging;
