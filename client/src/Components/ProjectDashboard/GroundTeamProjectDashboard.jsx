import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate ,useParams} from "react-router-dom";
import SalesManagerMessaging from '../Messaging/SalesManagerMessaging';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import ManagerGroundMessaging from '../Messaging/ManagerGroundMessaging';
import ManagerProjectControls from '../Utility/ManagerProjectControls';


function GroundTeamProjectDashboard() {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

    const params = useParams();
    const auth = getAuth();
    const navigate = useNavigate();
    const [dataforManagerControl , setdataforManagerControl] = useState({})
    const [toggle, setToggle] = useState(false);
    const [groundteamList, setGoundteamList] = useState([]);
    const [projectID, setProjectID] = useState('');
    const [project, setProjectData] = useState({
      type:"",
      status:"",
      schedule:"",
      projectid:"",
      manager_disapproval:"",
      img:[],
      groundteamid:"",
      description:"",
      date:"",
      startTime:"",
      endTime:"",
      imgPre:[],  
    });


  useEffect(() => {
    async function fetchProject() {
      console.log("GroundTeam Project Dashboard use effect")
      
      const docRef = doc(db, "ticket", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProjectData({...docSnap.data()});
        setProjectID(docSnap.id)
        console.log(project)
      }
      else console.log("No Data")
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
                    Ticket Dashboard
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
                  Ticket Dashboard
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
        <button className="bg-indigo-700 text-white rounded-md px-3 py-1 text-sm font-medium mr-3" onClick={()=>{navigate(`/groundteamdashboard`)}}>Back</button>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            Ticket Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div>
            
            <div className='bg-slate-50/50 rounded-md p-5'>  
                <ul className="divide-y divide-gray-100">
                  <div className='flex justify-center'>
                {(project.img && project.img.length !== 0) ? <div><h2 className="text-l mb-3 font-bold">Installation Images</h2><img className="mb-3" style={{width:"500px"}} src={project.img[0]}/></div>:null}
                </div>
                <div className='flex justify-center'>
                {(project.imgPre && project.imgPre.length !== 0) ? <div><h2  className="text-l mb-3 font-bold">Site Images</h2><img className="mb-3" style={{width:"500px"}} src={project.imgPre[0]}/></div>:null}
                </div>
                <div className='mb-3 flex justify-center'>
                  <li className="gap-x-6 py-5 ">
                    <div className="text-grey min-w-0 flex-auto">
                      <p className="text-m font-bold leading-6 ">Ticket Id: {projectID}</p>
                      <p className="mt-1 text-s leading-5 text-gray-900">Project Id: {project.projectid} </p>
                      <p className="mt-1 text-s leading-5 text-gray-900">Ticket Type: {project.type}</p>
                      <p className="mt-1 text-s leading-5 text-gray-900">Schedule Date: {project.date}</p>
                      <p className="mt-1 text-s leading-5 text-gray-900">Earliest Availability: {project.startTime}</p>
                      <p className="mt-1 text-s leading-5 text-gray-900">Latest Availability: {project.endTime}</p>
                      <p className="mt-1 text-s leading-5 text-gray-900">Description: {project.description}</p>
                      <p className="mt-1 text-s leading-5 text-gray-900">Status: {project.status}</p>
                    </div>
                    <div className='flex justify-center flex-col'>                    
                    </div>
                  </li>
                  
                    </div>
                    <ManagerGroundMessaging data={{projectData:{installationTicketID: projectID},auth: auth}}/>

                </ul>
                </div >

          </div>
        </div>
      </main>
    </div>
  );
}

export default GroundTeamProjectDashboard;