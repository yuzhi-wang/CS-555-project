import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";

function ManagerNewProject() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [projectAccepted, setprojectAccepted] = useState(false);
  const [trigger, setTrigger] = useState(false);

  async function acceptProject() {
    setTrigger(true);
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

  const AssignGroundTeam = (projectId) => {
    return(
      <>
        <form onSubmit={(e) => handelAccept(e, projectId)}>
          <label htmlFor="groundteam">Assign to a Ground Team:</label><br></br>
          <select value={groundteamid} onChange={(e) => setGoundteamId(e.target.value)} >
            {groundteamSelector()}
          </select>
          <input type="submit"></input>
          <button onClick={closeWindow()}>Cancel</button>
        </form>
      </>
    )
  }

  const closeWindow = () => {
    setTrigger(false);
    setGoundteamId("");
  }

  const handelAccept = async (e, projectId) => {
    e.preventDefault();
    try{
      // update project collection
      const projectRef = doc(db, "project", projectId);
      await updateDoc(projectRef, {
        ManagerAccepted: true,
        managerAssigned: auth.currentUser.uid,
        Status: "Manager Confirmed, Project will start Soon"
      });
    
      // create an installation ticket
      await addDoc(collection(db,"ticket"), {
        description: "Installation",
        groundteamid: groundteamid,
        projectid:projectId,
        schedule:"pending",
        status: "In Progress",
        type:"Installation"
      });

      alert(`Project ${projectId} Accepted`)
    }catch(e){
      alert(e);
    };
  }

  async function declineProject(projectID) {
    const projectRef = doc(db, "project", projectID);
    await updateDoc(projectRef, {
      ManagerAccepted: false,
      managerAssigned: "",
      Status: "Declined by Manager"
    });
    alert(`Declined Project ${projectID} `);
  }


  useEffect(() => {
    async function fetchProject() {
      console.log("Manager Project use effect")
      const projectRef = collection(db, "project");

      // Create a query against the collection.
      const q = query(projectRef, where("ManagerAccepted", "==", false));
      const querySnapshot = await getDocs(q);
      let Project = []

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
           Project.push({id:doc.id, data: doc.data()})
      
    });
    setProjectData(Project)
      

    }
    fetchProject();
  }, [auth.currentUser.uid]);



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
            <h3>Accept this Project ?</h3>
            <>
            <div>
              <button onClick={()=>acceptProject(project.id)} disabled={project.data.ManagerAccepted}>Accept</button>
            </div>
            </>
            { (trigger) && AssignGroundTeam(project.id)}
            <br/>
            </div>
            
          ))}
        </ul>
      </div>
      </div>
  )
}

export default ManagerNewProject;