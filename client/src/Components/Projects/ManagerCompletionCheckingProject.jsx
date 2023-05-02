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
  const [thisProject, setThisProject]= useState("")
  
  useEffect(() => {
      const fetchInfo1 = async () => {
          if (auth.currentUser){
              let arr1 = []
              
              const q1 = query(collection(db, "ticket"), where("managerid", "==", auth.currentUser.uid),
              where("status", "==", "Completion Checking"));
              
              const querySnapshot1 = await getDocs(q1);
              querySnapshot1.forEach((doc) => {
                  arr1.push({id1:doc.id, data1: doc.data()});
              });
              setIdetail1(arr1);              
             
          }
      };
      fetchInfo1();
      
    }, []);
  
  

  //clear signature pad
  const clear = () => sigCanvas.current.clear()

  // Save Signature
  const save = (ticketId) =>{
    setSignature(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    setThisProject(ticketId)
  }
 
  const ApproveButton = (projectId, ticketId) => {
    
    return (
      <></>
  )}


  const DisapproveButton = (projectId, ticketId) => {
    
    return <button key={ticketId} className="bg-blue-100 w-56 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={() => handleDisapprove(projectId, ticketId)}>Disapprove</button>
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
         
          description: "",
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
    
    
      
    
      return idetail1.map(info => (
        <div key={info.id1}> 
        <br/>
        <div className='bg-slate-50/50 rounded-md p-5'>  
          <ul className="divide-y divide-gray-100">
            <li className="flex justify-between gap-x-6 py-5 ">
              {info.data1.img.map((imgUrl, index) => (
                <img 
                  key={index} 
                  src={imgUrl} 
                  style={{ maxWidth: '30%', maxHeight: '30%' }} 
                />
                ))}
              <div className="min-w-0 flex-auto">
                <p className="text-m font-bold leading-6 ">Ticket Id: {info.id1}</p>
                <p className="mt-1 text-s leading-5 text-gray-900">Ticket Type: {info.data1.type}</p>
                <p className="mt-1 text-s leading-5 text-gray-900">Groundteam ID: {info.data1.groundteamid}</p>
                <p className="mt-1 text-s leading-5 text-gray-900">Completion Description: {info.data1.description}</p>
              </div>
              <div>
                {/* <button className="bg-blue-100 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={()=>{navigate(`/managerprojectdashboard/${project.id}`)}}>Project Detail</button> */}
                <>
                <div>
                <Popup modal trigger={<button className="bg-blue-100 w-56 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Mark Project Complete</button>} closeOnDocumentClick={false}>
                {close =>(
                <>
                <SignaturePad ref={sigCanvas} canvasProps={{
                    className:"signatureCanvas"
                }} />
                <button className="bg-blue-100 mr-5 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={()=>save(info.id1)}>Save</button>
                <button className="bg-blue-100 mr-5 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={clear}>Clear</button>
                <button className="bg-blue-100 mr-5 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={close}>Close</button>
                </>
                )}
                </Popup>
                <br/>
                <br/>
                {signature && thisProject === info.id1 ? (
                <div>
                <img key={info.id1} src={signature} alt='signature' style={{display:"block",
                margin: "0 auto",
                border:"1px solid black",
                width:"150px"}}/>
                <p>Once Signed, using Sign Pad click "Sign Invoice" to Submit it</p>
                <button key={info.id1} className="bg-blue-100 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={() => handleApprove(info.data1.projectid, info.id1)}>Sign Invoice</button>
                </div>
                ) :null}

                  </div>
              </>
                { DisapproveButton(info.id1,info.data1.ticketid)}
              </div>
            </li>
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