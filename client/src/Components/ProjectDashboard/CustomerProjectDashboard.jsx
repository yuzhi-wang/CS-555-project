import React, { useState, useEffect , useRef} from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate ,useParams} from "react-router-dom";
import SalesManagerMessaging from '../Messaging/SalesManagerMessaging';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";
import CustomerMessaging from '../Messaging/CustomerMessaging';
import {Popup} from "reactjs-popup"
import 'reactjs-popup/dist/index.css';
import SignaturePad from "react-signature-canvas"
import "./sign.css"
import ProgressBar from "@ramonak/react-progress-bar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFGenerator from '../PDFGenerator/PDFGenerator';


function CustomerProjectDashboard() {
    const sigCanvas = useRef({})
    
    const params = useParams();
    const auth = getAuth();
    const navigate = useNavigate();
    const [signature , setSignature] = useState(null)
    const [percentCompleted, setPercentCompleted] = useState("0")

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
    salesSignature:"",
    Quote: "",
    Proposal : "",
  });
  const [DoesProjectExists, setDoesProjectExists] = useState(false);

  //clear signature pad
  const clear = () => sigCanvas.current.clear()

  // Save Signature
  const save = () =>{
    setSignature(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    
  }

  async function handleSubmit(){
    //  save sugnature to storage and then to project database
    const projectRef = doc(db, "project", params.id);
  
        // Set the "capital" field of the city 'DC'
    await updateDoc(projectRef, {
      Status: "Preparing To Start The Project",
      CustomerSignature: signature,
    });
   
    alert(`Project ${params.id} Accepted You can now download Contract`);
    navigate(0)
  
}


  useEffect(() => {
    async function fetchProject() {
      console.log("Customer Project use effect")
      
      const docRef = doc(db, "project", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProjectData({projectID:docSnap.id,...docSnap.data()});
        let {customer,Status} = docSnap.data()
        if(Status === "Preparing To Start The Project" || Status === "Assigned to Manager, Project going to start soon !!") setPercentCompleted("20")
        if(Status === "Manager Confirmed, Project will start Soon") setPercentCompleted("50")
        if(Status === "Awaiting approval by Sales" || Status === "Awaiting Customer Signature") setPercentCompleted("10")
        
        if(customer)
        setDoesProjectExists(true)
      }
      else console.log("No Data")
    }
    fetchProject();
  }, []);


if(DoesProjectExists){
  return (
    <div>
        <h2>Customer Project Dashboard</h2>
        <div>
            {project.imgUrls.length !== 0 ? <img style={{width:"500px"}} src={project.imgUrls[0]}></img>:null}     
        <ul>
            <div>
                <li >ProjectID: {project.projectID}</li>
                <li>Customer:{project.customerName} </li>
                <li>Address:{project.address}</li>
                <li>Start Time:{project.startTime}</li>
                <li>End Time:{project.endTime}</li>
                <li>Purchased By: {project.customer}</li>
                <li>Sale Authorised: {project.SaleAuthorised ? "True" : "False"}</li>
                <li>Project Accepted: {project.ManagerAccepted ? "True" : "False"}</li>
                <li>Status: {project.Status} </li>
                <li>Quote Agreed Upon: {project.Quote === "" ? "No Quote Agreed Upon": project.Quote} </li>
                <li>Proposal: {project.Proposal === "" ? "No Proposal Discussed Yet": project.Proposal} </li>
            </div>     
        </ul>
      </div>
      <br/>
      {project.Status !== "Awaiting approval by Sales" || project.Status !== "Awaiting Customer Signature" ? 
      <div>
        <h2>Button to download Contract</h2> 
        <div>
      <PDFDownloadLink document={<PDFGenerator data={project}/>} filename="FORM">
      {({loading}) => (loading ? <button>Loading Document...</button> : <button>Download</button> )}
      </PDFDownloadLink>
      {/* <PDFFile /> */}
    </div>
    </div>:null }
      <br/>
      {project.Status !== "Awaiting Customer Signature" ? null:
    <div>
    <h2>Sign Contract To Get Project Started</h2>
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
<button onClick={handleSubmit}>Sign Contract</button>
</div>
) :null}

</div>}
<br/>
<br/>
<div>
<ProgressBar animateOnRender={true} completed={`${percentCompleted}%`} labelAlignment="center" height="30px" maxCompleted={100} width="50%" completedClassName={`barCompleted${percentCompleted}`} labelClassName="label"/>
<br/>
<h2>Current Status of the Project: {project.Status}</h2>
</div>
<br/>
<br/>
<br/>

 <CustomerMessaging/>
</div>
  );
}
else{
    return(
        <div>
            <h1>Project with Project ID: {params.id} Does not exist</h1>
        </div>
    )
}
}

export default CustomerProjectDashboard;
