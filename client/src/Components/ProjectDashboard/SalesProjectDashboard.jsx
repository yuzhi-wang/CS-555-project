import React, { useState, useEffect , useRef} from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate ,useParams} from "react-router-dom";
import SalesManagerMessaging from '../Messaging/SalesManagerMessaging';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";
import {Popup} from "reactjs-popup"
import 'reactjs-popup/dist/index.css';
import SignaturePad from "react-signature-canvas"

function SalesProjectDashboard() {
  const sigCanvas = useRef({})

    const params = useParams();
    const auth = getAuth();
    const navigate = useNavigate();
    const [signature , setSignature] = useState(null)
    const [formData, setFormData] = useState({
      Quote: "",
      Details: "",
  
    });
    const {
      Quote,
      Details
    } = formData;


//clear signature pad
const clear = () => sigCanvas.current.clear()

// Save Signature
const save = () =>{
  setSignature(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
  
}



  const [project, setProjectData] = useState({
    ManagerAccepted:"",
    SaleAuthorised:"",
    Status:"",
    customer:"",
    customerName:"",
    purchased:"",
    saleAssigned:"",
    projectID:"",
    address:"",
    imgUrls:[],
    startTime:"",
    endTime:"",
  });
  const [projectAccepted, setprojectAccepted] = useState(false);
  
  
  
  
  
  
  
  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function acceptProject(e) {
    e.preventDefault(e);
    //update user collection
    const projectRef = doc(db, "project", params.id);
  
        // Set the "capital" field of the city 'DC'
    await updateDoc(projectRef, {
      SaleAuthorised: true,
      Status: "Awaiting Customer Signature",
      salesSignature: signature,
      Quote: Quote,
      Proposal : Details,
    });
   
    alert(`Project ${params.id} Accepted`);
    navigate(0)
  }

async function startProject() {
    const projectRef = doc(db, "project", params.id);

    // Set the "capital" field of the city 'DC'
await updateDoc(projectRef, {
  SentToManager: true,
});

alert(`Project ${params.id} Successfully Started with Manager`);
navigate(0)
}


  useEffect(() => {
    async function fetchProject() {
      console.log("Sales Project use effect")
      
      const docRef = doc(db, "project", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let {SaleAuthorised}=docSnap.data()
        setProjectData({projectID:docSnap.id,...docSnap.data()});
        if(SaleAuthorised) setprojectAccepted(true)
      }
      else console.log("No Data")
    }
    fetchProject();
  }, []);



  return (
    <div>
        <h2>Sales Project Dashboard</h2>
        <br/>    
        
        {project.imgUrls.length !== 0 ? <img style={{width:"500px"}} src={project.imgUrls[0]}></img>:null}  
        <div>
          <ul>
            <li >ProjectID: {project.projectID}</li>
            <li>Customer:{project.customerName} </li>
            <li>Address:{project.address}</li>
            <li>Start Time:{project.startTime}</li>
            <li>End Time:{project.endTime}</li>
            <li>Purchased By: {project.customer}</li>
            <li>Sale Authorised: {project.SaleAuthorised ? "True" : "False"}</li>
            <li>Project Accepted: {project.ManagerAccepted ? "True" : "False"}</li>
            <li>Status: {project.Status} </li>
          </ul>
        </div>
        <br/>
        
      {project.SaleAuthorised ? null :
      <>
      <h3>Agreed Upon A Quote ?</h3>
      <form onSubmit={acceptProject}>
        <p >Enter Agreed Upon Quote:</p>
        <input
          type="text"
          id="Quote"
          value={Quote}
          onChange={onChange}
          placeholder="Enter Amount.."
          maxLength="32"
          minLength="4"
          required
            />

        <p >Proposal</p>
        <input
          type="text"
          id="Details"
          value={Details}
          onChange={onChange}
          placeholder="Enter Details.."
          maxLength="500000"
          minLength="10"
          required
            />
         
        <div>
          {signature ? <button type='submit'>Sign Contract</button>: null}
          {/*<button onClick={()=>declineProject(project.projectID)} disabled={project.Status === "Declined by Sales"}>Decline</button>*/}
        </div>
      </form>
      
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
   
    {signature ? (
        <div>
          <img src={signature} alt='signature' style={{display:"block",
            margin: "0 auto",
            border:"1px solid black",
            width:"150px"}}/>
        </div>
        ) :null}
    </>
    }
    {!project.CustomerSignature ? null: <h2>Button to download Contract</h2>}       
    {!project.CustomerSignature || !project.SentToManager ? <h2>Awaiting Customer Signature</h2>: 

    <>
    <h2>Start Project With Manager</h2>
    <buttom onClick={startProject}>Start Project</buttom>
    </>}

    <br/>
    <SalesManagerMessaging data={{projectData: project,auth: auth}}/>
    </div>
  );
}

export default SalesProjectDashboard;
