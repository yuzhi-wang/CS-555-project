import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { db } from '../../firebase';
import { query, collection, where, getDocs, doc, updateDoc, serverTimestamp, addDoc, getDoc, arrayUnion, setDoc, } from 'firebase/firestore';


function GroundteamInfoCreate() {
    const auth = getAuth();
    const navigate = useNavigate();

  const [info, setInfo] = useState({
    companyinfo: []
  });
  const Back = () => {
    window.location.replace('/groundteamdashboard');
};
function onLogout() {
    auth.signOut().then(()=>{
    alert("User Signed out")
    navigate("/");
    }).catch(()=>{
    alert("Error with signning out")
    })
    
  }
  
  function handleChange (event)  {
    const key = event.target.name;
    const value = event.target.value;
    setInfo(values => ({...values, [key]: value}))
  }
  async function handleSubmit(event) {
   
    event.preventDefault();
    
    
      const newdata = {
        
        
        
        CompanyInfo: info.companyinfo,
        ContactNumber:info.contactnumber,
        GroundteamId: auth.currentUser.uid,
        Members: info.members,
        
        
      }
      console.log(info);
      await setDoc(doc(collection(db, "GroundteamInfo"), auth.currentUser.uid), newdata);
      
      setInfo('');
      window.location.replace('/groundteamdashboard');
    
   
  }
  function handleKeyPress(event) {
    const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  }
  } 


useEffect(() => {
    const checkDocument = async () => {
      const docRef = doc(db, "GroundteamInfo", auth.currentUser.uid);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        window.location.replace('/groundteamdashboard');
      } 
    }
    checkDocument();
  }, []);
  
  return (
    
    <div>
        
       <button type="button" className="btn btn-danger btn-m" onClick={onLogout}>Log Out</button>
      <h2>My Information:</h2>
      
      <div>
        
      <form >
      <p >Company Information</p>
        <textarea 
        type="text" 
        name="companyinfo" 
        value={info.companyinfo || ""} 
        onChange={handleChange} 
        maxLength='200' 
        required={true}
        rows="3" 
        style={{resize: "vertical"}}>
        </textarea>
      <p >Team Members</p> 
        <textarea 
        type="text" 
        name="members" 
        value={info.members || ""} 
        onChange={handleChange} 
        maxLength='200' 
        required={true}
        rows="3" 
        style={{resize: "vertical"}}>
        </textarea>
      <p >Contact Number</p> 
      <input type="text" 
       name="contactnumber" 
       id="contactnumber" 
       value={info.contactnumber || ""} 
       onChange={handleChange} 
       onKeyPress={handleKeyPress} 
       maxLength='15' 
       required={true}/>

        <br/>
        <button onClick={handleSubmit}>Submit</button>
        </form>
      </div>
      <button type="button" className="btn btn-danger btn-m" onClick={Back}>Back</button>
    </div>
  );
}

export default GroundteamInfoCreate;
