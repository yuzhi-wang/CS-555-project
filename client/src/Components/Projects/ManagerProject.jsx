import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs, deleteDoc} from "firebase/firestore"; 
import { db } from "../../firebase";

function ManagerProject() {

    const auth = getAuth();
    const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [projectAccepted, setprojectAccepted] = useState(false);

  async function acceptProject(projectID) {
    
    //update user collection
    const projectRef = doc(db, "project", projectID);

        // Set the "capital" field of the city 'DC'
    await updateDoc(projectRef, {
        ManagerAccepted: true,
      Status: "Manager Confirmed, Project will start Soon"
    });

    alert(`Project ${projectID} Accepted`);
  
  }

async function declineProject(projectID, data) {
    
  const ticketRef = doc(db, "ticket", data.installationTicketID); 
  deleteDoc(ticketRef)
   
    
  const projectRef = doc(db, "project", projectID);
  await updateDoc(projectRef, {
  ManagerAccepted: false,
  Status: "Paused by Manager",
  managerAssigned: ""
});

alert(`Declined Project ${projectID} `);
}


  useEffect(() => {
    async function fetchProject() {
      console.log("Manager Project use effect")
      const projectRef = collection(db, "project");

      // Create a query against the collection.
      const q = query(projectRef, where("managerAssigned", "==", auth.currentUser.uid), where("ManagerAccepted", "==", true), 
      where("Status", "==", "Project Started, assigned to ground team"));
      const querySnapshot = await getDocs(q);
      let customerProject = []

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let {managerAssigned} = doc.data()
        if(managerAssigned === auth.currentUser.uid) {
            customerProject.push({id:doc.id, data: doc.data()})
        }
    });
    setProjectData(customerProject)
      

    }
    fetchProject();
  }, [auth.currentUser.uid]);

  const [trigger, setTrigger] = useState(false);
  const [currentProject, setCurrentProject] = useState("");

  const handelReassign = (projectId) => {
    setTrigger(true);
    setCurrentProject(projectId);
  }

  const [groundteamList, setGoundteamList] = useState([]);
  const [groundteamid, setGoundteamId] = useState('');

  useEffect(() => {
    const fetchGroundTeam = async () => {
      let arr = [];
      const docRef = collection(db, "users");
      const q = query(docRef, where("role", "==", "groundteam"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        arr.push({id:doc.id, data: doc.data()});
      });
      setGoundteamList(arr);
      setGoundteamId(arr[0].id);
    };
    fetchGroundTeam();
    },[]);

  const groundteamSelector = () => {
    return groundteamList.map(g => (<option key={g.id} value={g.id}>{g.data.name}</option>))
  }

  const reassignGroundteam = (projectId) => {
    return(
      <>
        <form onSubmit={(e) => handelAccept(e)}>
          <label htmlFor="project">Project Id:</label><br></br>
          <input type="text" readOnly={true} placeholder={currentProject} value={currentProject} ></input><br></br>
          <label htmlFor="groundteam">Reassign to a Ground Team:</label><br></br>
          <select value={groundteamid} onChange={(e) => setGoundteamId(e.target.value)} >
            {groundteamSelector()}
          </select>
          <input type="submit"></input>
          <button className="bg-blue-100 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={closeWindow}>Cancel</button>
        </form>
      </>
    )
  }

  const closeWindow = () => {
    setTrigger(false);
    setGoundteamId("");
  }

  const handelAccept = async (e) => {
    e.preventDefault();
    try{
      // update ticket collection
      const q = query(collection(db, "ticket"), where("projectid", "==", currentProject));
      const querySnapshot = await getDocs(q);
      var docId = "";
      var oldGroundteam = "";
      querySnapshot.forEach((doc) => {
        docId = doc.id;
        oldGroundteam = doc.data().groundteamid;
      });
      if (oldGroundteam === groundteamid){
        alert('No update');
        return;
      }
      const ticketRef = doc(db, "ticket", docId);
      await updateDoc(ticketRef, {
          groundteamid: groundteamid,
          img:"",
          completion_description:"",
          manager_diaspproval:""
      });

      alert(`Project ${currentProject} Reassigned`)
      setTrigger(false);
      setCurrentProject("");
    }catch(e){
      alert(e);
    };
  }

  return (
    <div>
        <div>     
        <ul>
          {projectData.length === 0 ? "No Projects On Going" : projectData.map((project, index) => (
            <div key={index}> 
            <br/>
            <div className='bg-slate-50/50 rounded-md p-5'>  
              <ul className="divide-y divide-gray-100">
                <li className="flex justify-between gap-x-6 py-5 ">
                  {project.data.imgUrls.length !== 0 ? <img style={{width:"350px"}} src={project.data.imgUrls[0]}></img>:null}
                  <div className="min-w-0 flex-auto">
                    <p className="text-m font-bold leading-6 ">ProjectID: {project.id}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Customer: {project.data.customerName} </p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Address: {project.data.address}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Date: {project.data.date}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Start Time: {project.data.startTime}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">End Time: {project.data.endTime}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Ground Team Assigned: {project.data.groundteamid}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Installation ticket ID: {project.data.installationTicketID}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Status: {project.data.Status} </p>
                  </div>
                  <div>
                    <button className="bg-blue-100 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={()=>{navigate(`/managerprojectdashboard/${project.id}`)}}>Project Detail</button>
                  </div>
                </li>
              </ul>
            </div>
            </div>

          ))}
        </ul>
      </div>
      {(trigger) && reassignGroundteam()}
      </div>
  );
}

export default ManagerProject;