import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";

function ManagerNewProject() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [groundteamList, setGoundteamList] = useState([]);
  const [groundteamid, setGoundteamId] = useState('');


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
        schedule:"pending",
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        status: "In Progress",
        type:"Installation",
        address: data.address,
        customer: data.customerName,
        managerid: auth.currentUser.uid
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
      
    let arr = [];
    const docRef = collection(db, "users");
    const q2 = query(docRef, where("role", "==", "groundteam"));
    const q2Snapshot = await getDocs(q2);
    q2Snapshot.forEach((doc) => {
      arr.push({id:doc.id, data: doc.data()});
    });
    console.log(arr)
    setGoundteamList(arr);
    setGoundteamId(arr[0].id);
    }
    fetchProject();
  }, [auth.currentUser.uid]);



  return (
    <div>
        <div>     
        <ul>

          {projectData.length === 0 ? "No New Projects To Start" : projectData.map((project, index) => (
            <div key={index}>
              <br/>
            <div  onClick={()=>{navigate(`/managerprojectdashboard/${project.id}`)}}>  
            {project.data.imgUrls.length !== 0 ? <img style={{width:"500px"}} src={project.data.imgUrls[0]}></img>:null}  
          <ul>
          <li >ProjectID: {project.id}</li>
                <li>Customer:{project.data.customerName} </li>
                <li>Address:{project.data.address}</li>
                <li>Project Size:{project.data.projectsize}</li>
                <li>Date:{project.data.date}</li>
                <li>Start Time:{project.data.startTime}</li>
                <li>End Time:{project.data.endTime}</li>
                <li>Sale Authorised: {project.data.SaleAuthorised ? "True" : "False"}</li>
                <li>Project Accepted: {project.data.ManagerAccepted ? "True" : "False"}</li>
                <li>Proposal: {project.data.Proposal} </li>
                <li>Status: {project.data.Status} </li>
          </ul>
          </div>   
            <h3>Start this Project ?</h3>
            <br/>
            <button onClick={()=>setToggle(!toggle)} disabled={project.data.ManagerAccepted}>Start Project</button>
            <br/>
            {toggle ? <>
              <form onSubmit={(e) => handelAccept(e, project.id, project.data)}>
              <label htmlFor="groundteam">Assign to a Ground Team:</label><br></br>
              <select id='groundteam' value={groundteamid} onChange={(e) => setGoundteamId(e.target.value)} >
              {groundteamSelector()}
              </select>
              <input type="submit"/>
              </form>
            </>:null}
            </div>
          ))}
        </ul>
      </div>
      </div>
  )
}

export default ManagerNewProject;