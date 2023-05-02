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
import ContractGenerator from '../PDFGenerator/ContractGenerator';
import InvoiceGenerator from '../PDFGenerator/InvoiceGenerator';
import { PaperClipIcon } from '@heroicons/react/20/solid'


function CustomerProjectDashboard() {
    const sigCanvas = useRef({})
    
    const params = useParams();
    const auth = getAuth();
    const navigate = useNavigate();
    const [signature , setSignature] = useState(null)
    const [percentCompleted, setPercentCompleted] = useState("0")

    const customLabelStyle = {
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      background: '',
    };
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
    CustomerSignature:"",
    salesignaftercomplete:"",
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

  const [maintenanceTrigger, setMaintenanceTrigger] = useState(false);
  const ButtonForMaintenance = () => {
    if (percentCompleted === "100"){
    return (
    <>
      <h2>Customer Service</h2>
      {renderMaintenanceTicket()}
      <button onClick={() => {setMaintenanceTrigger(true)}}>Request for Maintenance</button>
      {NewMaintenance(project)}

    </>
    )
    }
  }

  const [description,setDescription] = useState("");
  const [date, setDate] = useState('');
  const [startTime, setStartTime]= useState("");
  const [endTime, setEndTime]= useState("");

  const NewMaintenance = (project) => {
    if (maintenanceTrigger){
    return (
      <>
        <form onSubmit={(event) => submitTicket(event, project)}>
          <textarea type='text' id="description" name="description" placeholder='Problem Description' value={description} onChange={(event) => {
      setDescription(event.target.value)}}></textarea>
          <p >Location Hours of operation</p>   
          <p>Date</p>
          <input type="date" id="date" name="date" value={date} onChange={(event) => {
      setDate(event.target.value);}} required />
          <p>Start Time</p>
          <input type="time" id="appt" name="start" value={startTime} onChange={(event) => {
      setStartTime(event.target.value);}} min="06:00" max="21:00" required/>
          <p>End Time</p>
          <input type="time" id="appt" name="end" value={endTime} onChange={(event) => {
      setEndTime(event.target.value);}} min="06:00" max="21:00" required/>
          <small>Please select anytime between 6:00 am - 9:00 PM</small>
          <button type='submit'>Request for Maintenance</button>
        </form>
      </>
    )
  }
}
  
  let projectId = params.id;
  const [groundteam, setGroundteam] = useState("");
  useEffect(() => {
    const fetchGroundteam = async () => {
      const ticketRef = collection(db, "ticket");
      const q = query(ticketRef, where("projectid", "==", projectId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setGroundteam(doc.data().groundteamid);
    })
  };
  fetchGroundteam();}
  ,[]);

  const [MaintenanceTickets, setMaintenanceTickets] = useState([]);
  useEffect(() => {
    let MaintenanceTicket = [];
    const fetchMaintenanceTicket = async () => {
      const ticketRef = collection(db, "ticket");
      const q = query(ticketRef, where("projectid", "==", projectId), where("type", "==", "Maintenance"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        MaintenanceTicket.push(doc);
    })
    setMaintenanceTickets(MaintenanceTicket);
  }
  fetchMaintenanceTicket();}
  ,[]);

  const renderMaintenanceTicket = () =>{
    if (MaintenanceTickets.length > 0){
      return MaintenanceTickets.map(ticket => 
        <div key={ticket.id}>
          <ul>
            <li>Ticket Id:{ticket.id}</li>
            <li>Description:{ticket.data().description}</li>
            <li>Schedule:{ticket.data().date}</li>
            <li>Status:{ticket.data().status}</li>
          </ul>
        </div>
      )
    }
  }

  const submitTicket = async(event, project) => {
    event.preventDefault();
    try{
    let maintenanceticket = await addDoc(collection(db,"ticket"), {
      description: description,
      groundteamid: groundteam,
      projectid: params.id,
      startTime: startTime,
      endTime: endTime,
      date: date,
      status: "In Progress",
      type:"Maintenance",
      address: project.address,
      customer: project.customerName,
      managerid: project.managerAssigned
    });
    setMaintenanceTrigger(false);
  }catch(e){
    alert(e);
  }
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
        if(Status === "Manager Confirmed, Project will start Soon" || Status === "Project Started, assigned to ground team") setPercentCompleted("50")
        if(Status === "Awaiting approval by Sales" || Status === "Awaiting Customer Signature") setPercentCompleted("10")
        if (Status === "Completion approved by Manager" || Status === "Project Completed") setPercentCompleted("100")
        
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
  <header className="bg-white shadow-sm ">
        <div className="flex items-center mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <button className="bg-indigo-700 text-white rounded-md px-3 py-1 text-sm font-medium mr-3" onClick={()=>{navigate(`/customerdashboard`)}}>Back To Your Dashboard</button>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Customer Project Dashboard
          </h1>
        </div>
      </header>
    <div className="px-4 sm:px-0 ml-6">
      <h3 className="text-base font-semibold leading-7 text-gray-900">Project Applicant Information</h3>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
    </div>
    <div className="mt-6 ml-6 border-t border-gray-100">
      <dl className="divide-y divide-gray-100">
      {project.imgUrls.length !== 0 ? <img style={{width:"500px"}} src={project.imgUrls[0]}></img>:null}
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Your Progress: </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"><ProgressBar
        
        baseBgColor="gray"
        height="20px"
        width="80%"
        isLabelVisible={true}
        
        labelStyle={customLabelStyle}animateOnRender={true} completed={`${percentCompleted}%`}   maxCompleted={100} completedClassName={`barCompleted${percentCompleted}`} labelClassName="label"/></dd>
        </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Status:</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.Status}</dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Project ID</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.projectID}</dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Customer</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.customerName}</dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Address</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.address}</dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Start Time:</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.startTime}</dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">End Time:</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.endTime}</dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Purchased By:</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.customer}</dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Sale Authorised:</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.SaleAuthorised ? "True" : "False"}</dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Project Accepted:</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.ManagerAccepted ? "True" : "False"}</dd>
        </div>

        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Quote Agreed Upon: </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.Quote === "" ? "No Quote Agreed Upon": project.Quote}</dd>
        </div>
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Proposal: </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{project.Proposal === "" ? "No Proposal Discussed Yet": project.Proposal}</dd>
        </div>


        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Attachments</dt>
          <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">

          <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
              
            {!project.CustomerSignature || project.CustomerSignature === "" ? null:
              <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div className="flex w-0 flex-1 items-center">
                  <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">Contract.pdf</span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                <PDFDownloadLink document={<ContractGenerator data={project}/>} filename="FORM">
                    {({loading}) => (loading ? <button className="font-medium text-indigo-600 hover:text-indigo-500">Loading Document...</button> : <button className="font-medium text-indigo-600 hover:text-indigo-500">Download</button> )}
                </PDFDownloadLink>
                  {/*  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Download
                  </a>  */}
                  
                </div>
              </li>
            }
            {!project.salesignaftercomplete || project.salesignaftercomplete === "" ? null:
              <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div className="flex w-0 flex-1 items-center">
                  <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">Invoice.pdf</span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                <PDFDownloadLink document={<InvoiceGenerator data={project}/>} filename="FORM">
                    {({loading}) => (loading ? <button className="font-medium text-indigo-600 hover:text-indigo-500">Loading Document...</button> : <button className="font-medium text-indigo-600 hover:text-indigo-500">Download</button> )}
                </PDFDownloadLink>
                </div>
              </li>
            }
            </ul>
          </dd>
        </div>
      </dl>
    </div>
    <br/>
    <br/>


    {project.Status !== "Awaiting Customer Signature" ? null:
    <div>
    <h2 className="text-l font-bold">Sign Contract To Get Project Started</h2>
    <Popup modal trigger={<button className="bg-blue-100 w-56 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Open Signature Pad</button>} closeOnDocumentClick={false}>
        {close =>(
            <>
                <SignaturePad ref={sigCanvas} canvasProps={{
                    className:"signatureCanvas"
                }} />
                <button onClick={save} className="bg-blue-100 w-56 mr-5 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Save</button>
                <button onClick={clear} className="bg-blue-100 w-56 mr-5 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Clear</button>
                <button onClick={close} className="bg-blue-100 w-56 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Close</button>
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
<p>Once Signed, using Sign Pad click "Sign Contract" to Submit it</p>
<button onClick={handleSubmit} className="bg-blue-100 w-56 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Sign Contract</button>
</div>
) :null}

</div>}

<br/>
 <CustomerMessaging/>
 <br/>

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



