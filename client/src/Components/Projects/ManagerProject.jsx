import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
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

async function declineProject(projectID) {
    const projectRef = doc(db, "project", projectID);

    // Set the "capital" field of the city 'DC'
await updateDoc(projectRef, {
  ManagerAccepted: false,
  Status: "Declined by Manager"
});

alert(`Declined Project ${projectID} `);
}


  useEffect(() => {
    async function fetchProject() {
      console.log("Manager Project use effect")
      const projectRef = collection(db, "project");

      // Create a query against the collection.
      const q = query(projectRef, where("managerAssigned", "==", auth.currentUser.uid), where("ManagerAccepted", "==", true));
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
          <button onClick={closeWindow}>Cancel</button>
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
          groundteamid: groundteamid
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
            <div  onClick={()=>{navigate(`/managerprojectdashboard/${project.id}`)}}>
                <li >ProjectID: {project.id}</li>
                <li>Customer:{project.data.customerName} </li>
                <li>Purchased By: {project.data.customer}</li>
                <li>Sale Authorised: {project.data.SaleAuthorised ? "True" : "False"}</li>
                <li>Project Accepted: {project.data.ManagerAccepted ? "True" : "False"}</li>
                <li>Status: {project.data.Status} </li>
                </div>
            {project.data.ManagerAccepted ? <h3>Project Accepted</h3> : <h3>Accept this Project ?</h3>}
            <>
            <div>
              <button onClick={()=>acceptProject(project.id)} disabled={project.data.ManagerAccepted}>Accept</button>
              <button onClick={()=>declineProject(project.id)} disabled={project.data.Status === "Declined by Manager"}>Decline</button>
              <button onClick={()=>handelReassign(project.id)}>Reassign Groundteam</button>
             
            </div>
            </>
            <br/>
            </div>
             
          ))}
        </ul>
      </div>
      {(trigger) && reassignGroundteam()}
      </div>
  );
}

export default ManagerProject;