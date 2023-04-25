import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate ,useParams} from "react-router-dom";
import SalesManagerMessaging from '../Messaging/SalesManagerMessaging';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";
import ManagerGroundMessaging from '../Messaging/ManagerGroundMessaging';
import ManagerProjectControls from '../Utility/ManagerProjectControls';
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../Assets/Logo_white.png";


function ManagerProjectDashboard() {
    const params = useParams();
    const auth = getAuth();
    const navigate = useNavigate();
    const [dataforManagerControl , setdataforManagerControl] = useState({})
    const [toggle, setToggle] = useState(false);
    const [groundteamList, setGoundteamList] = useState([]);
    const [groundteamid, setGoundteamId] = useState('');
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

    function classNames(...classes) {
      return classes.filter(Boolean).join(" ");
    }

    const groundteamSelector = () => {
      return groundteamList.map(g => (<option key={g.id} value={g.id}>{g.data.name}</option>))
    }
  
  
    const handelAccept = async (e, projectId, data) => {
      e.preventDefault();
      setToggle(false)
      try{
        // create an installation ticket
        let installationticket = await addDoc(collection(db,"ticket"), {
          description: "Installation",
          groundteamid: groundteamid,
          projectid:projectId,
          startTime: data.startTime,
          endTime: data.endTime,
          date:data.date,
          status: "In Progress",
          type:"Installation",
          address: data.address,
          customer: data.customerName,
          managerid: auth.currentUser.uid,
          img:[],
          imgPre: data.imgUrls,
        });
        
        // update project collection
        const projectRef = doc(db, "project", projectId);
        await updateDoc(projectRef, {
          ManagerAccepted: true,
          managerAssigned: auth.currentUser.uid,
          Status: "Project Started, assigned to ground team",
          groundteamid: groundteamid,
          installationTicketID: installationticket.id
        });
        alert(`Project ${projectId} Started`)
      }catch(e){
        alert(e);
      };
    }




async function handelReassign(e, projectId, data) {
  e.preventDefault();
      setToggle(false)
      try{
        // create an installation ticket
        const ticketRef = doc(db, "ticket", data.installationTicketID);
        await updateDoc(ticketRef, {
          groundteamid: groundteamid,
        });
        
        // update project collection
        const projectRef = doc(db, "project", projectId);
        await updateDoc(projectRef, {
          groundteamid: groundteamid,
        });
        alert(`Ground team changed to ${groundteamid}`)
      }catch(e){
        alert(e);
      };
}



  useEffect(() => {
    async function fetchProject() {
      console.log("Manager Project Dashboard use effect")
      
      const docRef = doc(db, "project", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProjectData({projectID:docSnap.id,...docSnap.data()});
        setdataforManagerControl({projectID:docSnap.id,data:docSnap.data()})
      }
      else console.log("No Data")

      let arr = [];
    const groundref = collection(db, "users");
    const q2 = query(groundref, where("role", "==", "groundteam"));
    const q2Snapshot = await getDocs(q2);
    q2Snapshot.forEach((doc) => {
      arr.push({id:doc.id, data: doc.data()});
    });
    console.log(arr)
    setGoundteamList(arr);
    setGoundteamId(arr[0].id);
    }
    fetchProject();
  }, []);



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
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
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
                    <div className='flex justify-center flex-col'>
                    {project.ManagerAccepted ? 
                <>
                  <div>
                    {/* <button>Pause Project</button> */}
                    <button className="bg-blue-100 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={()=>setToggle(!toggle)}>Re-Assign Ground Team</button>
                    <br/>
                    {toggle ? <>
                    <form onSubmit={(e) => handelReassign(e, project.projectID, project)}>
                      <select id='groundteam' value={groundteamid} onChange={(e) => setGoundteamId(e.target.value)} >
                        {groundteamSelector()}
                      </select>
                      <input type="submit"/>
                    </form>
                    </>:null}
                  </div>
                </> : <>
                  <button className="bg-blue-100 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={()=>setToggle(!toggle)} disabled={project.ManagerAccepted}>Start Project</button>
                  {toggle ? <>
                    <form className="box-" onSubmit={(e) => handelAccept(e, project.projectID, project)}>
                      <label className="text-m font-bold text-black" htmlFor="groundteam">Assign to a Ground Team:</label><br></br>
                      <select id='groundteam' value={groundteamid} onChange={(e) => setGoundteamId(e.target.value)} >
                        {groundteamSelector()}
                      </select>
                      <button type="submit" className="bg-blue-100 mt-3 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded">Submit</button>
                    </form>
                  </>:null}
                </>}
                    </div>
                  </li>
                  
                    </div>
                  
                  
                  
                
                </ul>
                <ManagerGroundMessaging data={{projectData: project,auth: auth}}/>
                <br/>
                <SalesManagerMessaging data={{projectData: project,auth: auth}}/>
                </div >

          </div>
        </div>
      </main>
    </div>
  );
}

export default ManagerProjectDashboard;