import React, { useState, useEffect , useRef} from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate ,useParams} from "react-router-dom";
import SalesManagerMessaging from '../Messaging/SalesManagerMessaging';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";
import {Popup} from "reactjs-popup"
import 'reactjs-popup/dist/index.css';
import SignaturePad from "react-signature-canvas"
import { PDFDownloadLink } from "@react-pdf/renderer";
import ContractGenerator from '../PDFGenerator/ContractGenerator';
import InvoiceGenerator from '../PDFGenerator/InvoiceGenerator';

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
    SentToManager:false,
    salesSignature:"",
    Quote: "",
    Proposal : "",
    invoice:false,
  });
  const [projectAccepted, setprojectAccepted] = useState(false);
  const [invoice, setInvoice] = useState(false);
  
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
      SentToManager: false,
    });
   
    alert(`Project ${params.id} Accepted`);
    navigate(0)
  }

async function startProject() {
    const projectRef = doc(db, "project", params.id);

    // Set the "capital" field of the city 'DC'
await updateDoc(projectRef, {
  SentToManager: true,
  Status:"Assigned to Manager, Project going to start soon !!"
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
        setInvoice(docSnap.data().invoice);
        if(SaleAuthorised) setprojectAccepted(true)
      }
      else console.log("No Data")
    }
    fetchProject();
  }, []);

  const sendInvoice = async(project) => {
    const projectRef = doc(db, "project", params.id);
    try{
      await updateDoc(projectRef, { invoice: true})
      setInvoice(true);
    }catch(e){
      alert(e)
    }
  }

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
                <li>Quote Agreed Upon: {project.Quote === "" ? "No Quote Agreed Upon": project.Quote} </li>
                <li>Proposal: {project.Proposal === "" ? "No Proposal Discussed Yet": project.Proposal} </li>
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
        <textarea
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
    {project.Status === "Awaiting Customer Signature" ? <h2>Awaiting Customer Signature to send project to the manager</h2>:null }
    {project.Status !== "Awaiting approval by Sales" || project.Status !== "Awaiting Customer Signature" ?  
    <div>
      <h2>Button to download Documents </h2>
      <div>
        <h3>Contract</h3>
        <PDFDownloadLink document={<ContractGenerator data={project}/>} filename="FORM">
        {({loading}) => (loading ? <button>Loading Document...</button> : <button>Download</button> )}
        </PDFDownloadLink>
        <h3>Invoice</h3>
        <button disabled={invoice} onClick = {async()=> {await sendInvoice()}}>Send Invoice</button>
        <PDFDownloadLink document={<InvoiceGenerator data={project}/>} filename="FORM">
        {({loading}) => (loading ? <button disabled={!project.invoice}>Loading Document...</button> : <button disabled={!invoice}>Download</button> )}
        </PDFDownloadLink>
      </div>
    </div>:null }       
    {project.Status === "Preparing To Start The Project" ? 
    <>
    <h2>Start Project With Manager</h2>
    <button onClick={startProject}>Start Project</button>
    </>: null}
    <br/>
    <br/>
    <SalesManagerMessaging data={{projectData: project,auth: auth}}/>
    </div>
  );
}

export default SalesProjectDashboard;
