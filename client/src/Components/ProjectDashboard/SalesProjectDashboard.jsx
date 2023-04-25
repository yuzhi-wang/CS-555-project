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
import { Disclosure, Menu, Transition } from "@headlessui/react";
import ContractGenerator from '../PDFGenerator/ContractGenerator';
import InvoiceGenerator from '../PDFGenerator/InvoiceGenerator';

function SalesProjectDashboard() {

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  
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
    setSignature(null)
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
      await updateDoc(projectRef, { 
        invoice: true,
        Status:"Project Completed",
        salesignaftercomplete: signature
      })
      setInvoice(true);
      setSignature(null)
      alert(`Congratulations Project ${params.id} Completed !!!`);
      navigate(0)
    }catch(e){
      alert(e)
    }
  }

  return (

    <div className="min-h-full">
      <Disclosure as="nav" className="bg-indigo-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="ml-10 flex items-baseline space-x-4">
                  <div
                    className={classNames(
                      //   item.current ?
                      "bg-indigo-700 text-white",
                      // : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                    //   aria-current={item.current ? "page" : undefined}
                  >
                    Project Dashboard
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {/* {navigation.map((item) => ( */}
                <Disclosure.Button
                  // key={item.name}
                  as="div"
                  // href={item.href}
                  className={classNames(
                    //   item.current ?
                    "bg-indigo-700 text-white",
                    // : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  // aria-current={item.current ? "page" : undefined}
                >
                  Project Dashboard
                  {/* {item.name} */}
                </Disclosure.Button>
                {/* ))} */}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <header className="bg-white shadow-sm">
        <div className="flex items-center mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <button className="bg-indigo-700 text-white rounded-md px-3 py-1 text-sm font-medium mr-3" onClick={()=>{navigate(`/salesdashboard`)}}>Back</button>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Project Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div>
            <div className='bg-slate-50/50 rounded-md p-5'>  
                <ul className="divide-y divide-gray-100">
                  <div className='flex justify-center'>
                {project.imgUrls.length !== 0 ? <img className="mb-3" style={{width:"500px"}} src={project.imgUrls[0]}></img>:null}
                </div>
                <div className='mb-3 flex justify-center'>
                  <li className="gap-x-6 py-5 ">
                    <div className="text-grey min-w-0 flex-auto">
                      <p className="text-m font-bold leading-6 ">ProjectID: {project.projectID}</p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">Customer: {project.customerName} </p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">Address: {project.address}</p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">Start Time: {project.startTime}</p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">End Time: {project.endTime}</p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">Purchased By: {project.customer}</p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">Sale Authorised: {project.SaleAuthorised ? "True" : "False"}</p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">Project Accepted: {project.ManagerAccepted ? "True" : "False"}</p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">Status: {project.Status}</p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">Quote Agreed Upon: {project.Quote === "" ? "No Quote Agreed Upon": project.Quote}</p>
                      <p className="mt-1 truncate text-s leading-5 text-gray-900">Proposal: {project.Proposal === "" ? "No Proposal Discussed Yet": project.Proposal}</p>
                    </div>
                    <div >
                    {project.SaleAuthorised ? null :
      <div className="flex justify-center mt-10">
        <h3 className="text-l font-bold">Agreed Upon A Quote ?</h3>
        <form  onSubmit={acceptProject}>
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
          <br></br>
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
          <br></br>
          <div>
            {signature ? <><p>Once Signed, using Sign Pad click "Sign Contract" to Submit it</p><button type='submit' className="bg-blue-100 mb-3 w-56 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Sign Contract</button></>: null}
            {/*<button onClick={()=>declineProject(project.projectID)} disabled={project.Status === "Declined by Sales"}>Decline</button>*/}
          </div>
        
      
      <Popup modal trigger={<button className="bg-blue-100 w-56 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Open Signature Pad</button>} closeOnDocumentClick={false}>
        {close =>(
            <>
                <SignaturePad ref={sigCanvas} canvasProps={{
                    className:"signatureCanvas"
                }} />
                <button onClick={save} className="bg-blue-100 mr-5 w-56 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Save</button>
                <button onClick={clear} className="bg-blue-100 mr-5 w-56 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Clear</button>
                <button onClick={close} className="bg-blue-100 w-56 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Close</button>
            </>
        )}
      </Popup>
      </form>
      <br/>
   
    {signature ? (
        <div>
          <img src={signature} alt='signature' style={{display:"block",
            margin: "0 auto",
            border:"1px solid black",
            width:"150px"}}/>
        </div>
        ) :null}
    </div>
    }
    </div>

     {project.Status === "Awaiting Customer Signature" ? <h2 className="text-l font-bold">Awaiting Customer Signature to send project to the manager</h2>:null }
     {project.Status !== "Awaiting approval by Sales" || project.Status !== "Awaiting Customer Signature" ?  
    <div className="mt-10">
      <h2 className="text-l font-bold">Button to download Contract </h2>
      <div>
        <PDFDownloadLink document={<ContractGenerator data={project}/>} filename="FORM">
        {({loading}) => (loading ? <button className="bg-blue-100 mt-3 w-56 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Loading Document...</button> : <button className="bg-blue-100 w-56 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Download</button> )}
        </PDFDownloadLink>
      </div>
    </div>:null }       
    {project.Status === "Preparing To Start The Project" ? 
    <>
    <h2 className="text-l font-bold">Start Project With Manager</h2>
    <button onClick={startProject} className="bg-blue-100 w-56 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Start Project</button>
    </>: null}
    <br/>

    <div>
    {project.Status === "Completion approved by Manager"  ? 
    <>
    <div>
    <h2 className="text-l font-bold">Sign To Mark Project Complete</h2>
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
    <br/>
{signature ? (
        <div>
        <img src={signature} alt='signature' style={{display:"block",
    margin: "0 auto",
border:"1px solid black",
width:"150px"}}/>
<p>Once Signed, using Sign Pad click "Send Invoice" to send it</p>
<button onClick={() => sendInvoice() } className="bg-blue-100 w-56 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Send Invoice</button>
</div>
) :null}
</div>
</>
    : null}
<br/>

{project.Status === "Project Completed" ? 
<>
<h3 className="text-l font-bold">Download Invoice Here</h3>
        <PDFDownloadLink document={<InvoiceGenerator data={project}/>} filename="FORM">
        {({loading}) => (loading ? <button disabled={!project.invoice} className="bg-blue-100 w-56 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Loading Document...</button> : <button disabled={!invoice} className="bg-blue-100 w-56 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Download Invoice</button> )}
        </PDFDownloadLink>
</>:null}
    <br/>
    <br/>
    <SalesManagerMessaging data={{projectData: project,auth: auth}}/>
    </div>
     </li>
     </div>
     </ul>
                </div >

          </div>
        </div>
      </main>
    </div>

 

//           
//         



      
    





  );
}

export default SalesProjectDashboard;
