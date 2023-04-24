import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate ,useParams} from "react-router-dom";
import SalesManagerMessaging from '../Messaging/SalesManagerMessaging';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";
import ManagerGroundMessaging from '../Messaging/ManagerGroundMessaging';
import ManagerProjectControls from '../Utility/ManagerProjectControls';


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
    <div>
        <h2>Project Dashboard</h2>
        <div>     
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
      </div>
      
      {project.ManagerAccepted ? <>
            <div>
              <button>Pause Project</button>

              <button onClick={()=>setToggle(!toggle)}>Re-Assign Ground Team</button>
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



            <h3>Start this Project ?</h3>
            <br/>
            <button onClick={()=>setToggle(!toggle)} disabled={project.ManagerAccepted}>Start Project</button>
            <br/>
            {toggle ? <>
              <form onSubmit={(e) => handelAccept(e, project.projectID, project)}>
              <label htmlFor="groundteam">Assign to a Ground Team:</label><br></br>
              <select id='groundteam' value={groundteamid} onChange={(e) => setGoundteamId(e.target.value)} >
              {groundteamSelector()}
              </select>
              <input type="submit"/>
              </form>
            </>:null}
            </>}
            
    
      <br/>
      <br/>
      <ManagerGroundMessaging data={{projectData: project,auth: auth}}/>
      <br/>
      <br/>
      <SalesManagerMessaging data={{projectData: project,auth: auth}}/>
      </div>
  );
}

export default ManagerProjectDashboard;