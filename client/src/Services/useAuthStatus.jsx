import { useEffect, useState, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc  } from "firebase/firestore"; 
import { db } from "../firebase";



export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [role, setRole] = useState("")

  useEffect(() => {
    const auth = getAuth();

    //console.log(auth);
   onAuthStateChanged(auth, async (user) => { 
     console.log("here")

      if (user) {
       
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let { role } = docSnap.data()
          setRole(role)
          setLoggedIn(true);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
      setCheckingStatus(false);
    });
  }, []);
  return { loggedIn, checkingStatus , role };
}

// this is used to check if the user is logged in and authenticated