import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./OAuth.styles.css";
import { FcGoogle } from "react-icons/fc";

export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // check for the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          role:"customer",
          projectID: "",
          timestamp: serverTimestamp(),
        });
      }

      navigate("/");
    } catch (error) {
      alert("Could not authorize with Google");
    }
  }
  return (
    <button className="GoogleButton" type="button" onClick={onGoogleClick}>
      <FcGoogle size={20}/>
    </button>
  );
}
