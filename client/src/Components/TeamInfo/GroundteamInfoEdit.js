import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { db } from '../../firebase';
import { query, collection, where, getDocs, doc, updateDoc, serverTimestamp, addDoc, getDoc, arrayUnion, setDoc, } from 'firebase/firestore';


function GroundteamInfoEdit() {
    const auth = getAuth();
    const navigate = useNavigate();
  const [data, setData] = useState([]);
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
    
    
      
      const infoRef = doc(db, "GroundteamInfo", auth.currentUser.uid);
     
      
      
      
        await updateDoc(infoRef, {
           
            CompanyInfo: info.companyinfo,
            ContactNumber:info.contactnumber,
            Members: info.members,
            
          
          });
     

      setInfo('');
      window.location.replace('/groundteamdashboard/infoedit');
    
   
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
  
        if (!docSnapshot.exists()) {
          window.location.replace('/groundteamdashboard');
        } 
      }
      checkDocument();
    const fetchInfo = async () => {
        if (auth.currentUser){
            let arr = []
            const q = query(collection(db, "GroundteamInfo"), where("GroundteamId", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                arr.push({id:doc.id, data: doc.data()});
            });
        setData(arr);
        
        }
    };
    fetchInfo();
    
  }, []);
  useEffect(() => {
    
   
    if (typeof data[0] !== 'undefined' && data[0] !== null) {
        
        
        setInfo(prevInfo => ({
      
            ...prevInfo,
          
          companyinfo: data[0].data.CompanyInfo,
          members: data[0].data.Members,
          contactnumber: data[0].data.ContactNumber,
        }));
      }
  }, [data]);
  
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

export default GroundteamInfoEdit;
