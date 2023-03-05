// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdU63aCMKiwfHz3fUaS-u6VycwhWLkW-I",
  authDomain: "agile-11fe1.firebaseapp.com",
  projectId: "agile-11fe1",
  storageBucket: "agile-11fe1.appspot.com",
  messagingSenderId: "83028940886",
  appId: "1:83028940886:web:61dc12efb38234608103f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()