import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate ,useParams} from "react-router-dom";
import SalesManagerMessaging from '../Messaging/SalesManagerMessaging';
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";
import ManagerGroundMessaging from '../Messaging/ManagerGroundMessaging';
import ManagerProjectControls from '../Utility/ManagerProjectControls';


function GroundTeamProjectDashboard() {
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
      }
      else console.log("No Data")
    }
    fetchProject();
  }, []);



  return (
    <div>
        <h2>{project.type} Ticket</h2>
        <div>     
        <div>
            
            {project.img.length !== 0 ? <><h2>Post installation Images</h2><img style={{width:"500px"}} src={project.img[0]}/></>:null}  
            {project.imgPre.length !== 0 ? <><h2>Site Images</h2><img style={{width:"500px"}} src={project.imgPre[0]}/></>:null}   
        <div>
        <ul>
           
                            <ul>
                            <li>Ticket Id:{projectID}</li>
                            <li>Project Id:{project.projectid}</li>
                            <li>Ticket Type:{project.type}</li>
                            <li>Schedule Date:{project.date}</li>
                            <li>Earliest Availability:{project.startTime}</li>
                            <li>Latest Availability:{project.endTime}</li>
                            <li>Description:{project.description}</li>
                            <li>Status:{project.status}</li>
                            </ul>
        </ul>
        </div> 
      </div>
      </div>
            
    
      <br/>
      <br/>
      <ManagerGroundMessaging data={{projectData:{installationTicketID: projectID},auth: auth}}/>
      <br/>
      
      </div>
  );
}

export default GroundTeamProjectDashboard;