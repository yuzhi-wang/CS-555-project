import React, { useState, useEffect , useRef} from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import SignaturePad from "react-signature-canvas"
import "./sign.css"
import {Popup} from "reactjs-popup"
import 'reactjs-popup/dist/index.css';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs, deleteDoc} from "firebase/firestore"; 
import { db } from "../../firebase";

function ManagerCompletionCheckingProject() {
  const sigCanvas = useRef({})
  const auth = getAuth();
  const navigate = useNavigate();
  const [signature , setSignature] = useState(null)
  const [idetail1, setIdetail1] = useState([])
  const [idetail2, setIdetail2] = useState([])
  const [idetail3, setIdetail3] = useState([])
  
  useEffect(() => {
      const fetchInfo1 = async () => {
          if (auth.currentUser){
              let arr1 = []
              
              const q1 = query(collection(db, "project"), where("managerAssigned", "==", auth.currentUser.uid),
              where("Status", "==", "Completion reported by groundteam. Waiting for check of Manager."));
              
              const querySnapshot1 = await getDocs(q1);
              querySnapshot1.forEach((doc) => {
                  arr1.push({id1:doc.id, data1: doc.data()});
              });
              setIdetail1(arr1);              
            
          }
      };
      fetchInfo1();
      
    }, []);
  
  useEffect(() => {
    const fetchInfo2 = async () => {    
        if (idetail1.length > 0) {
          let arr2 = [];
          let i = 0;
          while (idetail1.length > i){
            
            
              const q2 = query(collection(db, "ticket"), where("projectid", "==", idetail1[i].id1));
              const querySnapshot2 = await getDocs(q2);
              querySnapshot2.forEach((doc) => {
                  arr2.push({id2:doc.id, data2: doc.data()});
              });
              
              
            
            
            i = i + 1
          }
          setIdetail2(arr2);
        }
    }
    fetchInfo2();
    

      }, [idetail1]);
  useEffect(() => {
    if (idetail2.length > 0) {
    let updatedIdetail1 = [...idetail1];
    // console.log(idetail1)
    // console.log(idetail2)
    let i = 0;
    while (updatedIdetail1.length > i){

        updatedIdetail1[i].data1["completion_description"] = idetail2[i].data2.completion_description
        updatedIdetail1[i].data1["groundteamid"] = idetail2[i].data2.groundteamid
        updatedIdetail1[i].data1["ticketid"] = idetail2[i].id2
        updatedIdetail1[i].data1["type"] = idetail2[i].data2.type
        updatedIdetail1[i].data1["groundteam_img"] = idetail2[i].data2.img
        i = i + 1
        

    }
    setIdetail3(updatedIdetail1);
    }
  }, [idetail2])
  useEffect(() => {
    if (idetail3.length > 0) {
    console.log(idetail3[0])}
    
  },[idetail3])
  //clear signature pad
  const clear = () => sigCanvas.current.clear()

  // Save Signature
  const save = () =>{
    setSignature(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    
  }
 
  const ApproveButton = (projectId, ticketId) => {
    
    return (
      <>
    <div>
    <h2>Sign To Mark Project Complete</h2>
    <Popup modal trigger={<button>Open Signature Pad</button>} closeOnDocumentClick={false}>
        {close =>(
            <>
                <SignaturePad ref={sigCanvas} canvasProps={{
                    className:"signatureCanvas"
                }} />
                <button onClick={save}>Save</button>
                <button onClick={clear}>Clear</button>
                <button onClick={close}>Close</button>
            </>
        )}
        </Popup>
    <br/>
    <br/>
{signature ? (
        <div>
        <img src={signature} alt='signature' style={{display:"block",
    margin: "0 auto",
border:"1px solid black",
width:"150px"}}/>
<p>Once Signed, using Sign Pad click "Sign Contract" to Submit it</p>
<button key={projectId} onClick={() => handleApprove(projectId, ticketId)}>Sign Contract</button>
</div>
) :null}

</div>
</>
  )}


  const DisapproveButton = (projectId, ticketId) => {
    
    return <button key={ticketId} onClick={() => handleDisapprove(projectId, ticketId)}>Disapprove</button>
  }
  async function handleApprove(projectId, ticketId) {
    //   setCurrentTicket(ticketId);
    //   setCurrentProject(projectId);
      const infoRef = doc(db, "ticket", ticketId);
    
      const infoRef1 = doc(db, "project", projectId);
        await updateDoc(infoRef, {
           
            
            status: "Completed",
            manager_disapproval: ""
          });
        await updateDoc(infoRef1, {
            Status: "Completion approved by Manager",
            managersignatureaftercomplete: signature, 
          });

  
      alert(`Project ${projectId} completion approved.`);
    //   setCurrentTicket("");
    //   setCurrentProject("");
      
      window.location.replace('/managerdashboard');
    
   
  }
  async function handleDisapprove(projectId, ticketId) {
    const reason = prompt("The reason of disapproval:");
    // setCurrentTicket(ticketId);
    // setCurrentProject(projectId);
    const infoRef = doc(db, "ticket", ticketId);
  
    const infoRef1 = doc(db, "project", projectId);
      await updateDoc(infoRef, {
         
          completion_description: "",
          status: "Completion Disapproved",
          manager_disapproval: reason,
          img: ""

        });
      await updateDoc(infoRef1, {
         
          
          Status: "Manager Confirmed, Project will start Soon"

        });
    alert(`Project ${projectId} completion disapproved.`);
    // setCurrentTicket("");
    // setCurrentProject("");
    
    window.location.replace('/managerdashboard');
  
 
}
 

  const renderInfo = () => {
    
    
      if (idetail3.length === 0){
          let s = <div>
          <p>No Completion reported</p>
          
          </div>
          return s; 
          
      }
      
    
      return idetail3.map(info => (
        <div key={info.id1}>
            <div className='tickets'>
               <ul>
                  <h4>{info.id1}</h4>
                  {info.data1.groundteam_img.map((imgUrl, index) => (
                    <img 
                      key={index} 
                      src={imgUrl} 
                      style={{ maxWidth: '30%', maxHeight: '30%' }} 
                    />
                    ))}
                  <div>
                    <li>Ticket Id:{info.data1.ticketid}</li>
                    <li>Ticket Type:{info.data1.type}</li>
                    <li>Groundteam ID:{info.data1.groundteamid}</li>
                    <li>Completion Description:{info.data1.completion_description}</li>
                  </div>
                
                  
                 
                  <div>
                    { ApproveButton(info.id1,info.data1.ticketid)}
                    { DisapproveButton(info.id1,info.data1.ticketid)}
                  </div>
                </ul>  
            </div>
        </div>
      ));
  }

  return (
    <>
    
    {renderInfo()}
  
    </>
)
  
  

 
}

export default ManagerCompletionCheckingProject;