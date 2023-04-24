import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { query, collection, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from "uuid";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
  } from "firebase/storage";
const GroundteamProject = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [tickettype, setTickettype] = useState("All");
    const [selectstatus, setSelectstatus] = useState("In Progress");
    const [info, setInfo] = useState({images:{},});
    const filter = () => {
        return (
            <div>
                {/* <label>filter:</label> */}
                <select value={tickettype} onChange={(e) => setTickettype(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Installation">Installation</option>
                    <option value="Maintenance">Maintenance</option>
                </select>
                <select value={selectstatus} onChange={(e) => setSelectstatus(e.target.value)}>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Completion Checking">Completion Checking</option>
                </select>
            </div>
        )
    }

    const [tdetail, setTdetail] = useState([])
    useEffect(() => {
        const fetchTicket = async () => {
            if (auth.currentUser){
                let arr = []
                const q = query(collection(db, "ticket"), where("groundteamid", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    arr.push({id:doc.id, data: doc.data()});
                });
            setTdetail(arr);
            }
        };
        fetchTicket();
      }, []);
    
    function handleChange (event)  {
        const key = event.target.name;
        const value = event.target.value;
        setInfo(values => ({...values, [key]: value}))
        if (event.target.files) {
            setInfo((prevState) => ({
              ...prevState,
              images: event.target.files,
            }));
          }
      }
    async function handleSubmit(event) {
   
        event.preventDefault();
        if (info.images.length > 6) {
            alert("maximum 6 images are allowed");
            return;
        }
        async function storeImage(image) {
            return new Promise((resolve, reject) => {
              const storage = getStorage();
              const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
              const storageRef = ref(storage, filename);
              const uploadTask = uploadBytesResumable(storageRef, image);
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      console.log("Upload is paused");
                      break;
                    case "running":
                      console.log("Upload is running");
                      break;
                  }
                },
                (error) => {
                  // Handle unsuccessful uploads
                  reject(error);
                },
                () => {
                  // Handle successful uploads on complete
                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                  });
                }
              );
            });
        }
        const imgUrls = await Promise.all(
            [...info.images].map((image) => storeImage(image))
        ).catch((error) => {
            alert("Images not uploaded");
            return;
        });
        // const infoCopy = {
        //     ...info,
            
        //   };
        // delete infoCopy.images;
        const infoRef = doc(db, "ticket", currentTicket);
        
        const infoRef1 = doc(db, "project", currentProject);
        await updateDoc(infoRef, {
               
            completion_description: info.completion_description,
            status: "Completion Checking",
            img: imgUrls
            });
        await updateDoc(infoRef1, {
               
                
            Status: "Completion reported by groundteam. Waiting for check of Manager."
 
            });
         
    
        setInfo("");
        setTrigger(false);
        setCurrentTicket("");
        setCurrentProject("");
        alert("Submitted successfully! Please wait for Manager's confirmation. ");
        window.location.replace('/groundteamdashboard');
        
       
      }
    const renderTickets = () => {
        let detail = tdetail;
        if (selectstatus === 'In Progress'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.data.status === 'In Progress')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.data.type === 'Installation' && d.data.status === 'In Progress')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.data.type === 'Maintenance' && d.data.status === 'In Progress')
            }
        }
        if (selectstatus === 'Completion Checking'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.data.status === 'Completion Checking')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.data.type === 'Installation' && d.data.status === 'Completion Checking')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.data.type === 'Maintenance' && d.data.status === 'Completion Checking')
            }
        }else if (selectstatus === 'Completed'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.data.status === 'Completed')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.data.type === 'Installation' && d.data.status === 'Completed')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.data.type === 'Maintenance' && d.data.status === 'Completed')
            }
        }
        if (detail.length === 0){
            return <p>No tickets</p>
        }
        return detail.map(ticket => (
            // Ticket(ticket) 
            <div key={ticket.id} className='ticketseperator'>
                <div className='tickets'>
                    <div className='left' onClick={()=>{navigate(`/groundteamprojectdashboard/${ticket.id}`)}}>
                        <h4>{ticket.id}</h4>
                        <div>
                            <ul>
                            <li>Project Id:{ticket.data.projectid}</li>
                            <li>Ticket Type:{ticket.data.type}</li>
                            <li>Schedule Date:{ticket.data.date}</li>
                            <li>Earliest Availability:{ticket.data.startTime}</li>
                            <li>Latest Availability:{ticket.data.endTime}</li>
                            <li>Description:{ticket.data.description}</li>
                            <li>Status:{ticket.data.status}</li>
                            </ul>
                        </div>
                        
                    </div>
                    <div>
                    {(ticket.data.status === 'In Progress') && completeButton(ticket.id, ticket.data.projectid)}
                    </div>
                </div>
            </div>
          ));
    }

    const completeButton = (ticketId, projectId) => {
        return <button key={ticketId} onClick={() => handleCompletion(ticketId, projectId)}>Complete</button>
    }

    const [trigger, setTrigger] = useState(false);
    const [currentTicket, setCurrentTicket] = useState('');
    const [currentProject, setCurrentProject] = useState('');
    const handleCompletion = (ticketId, projectId) => {
        setTrigger(true);
        setCurrentTicket(ticketId);
        setCurrentProject(projectId);
    }

    const cancel = () => {
        setTrigger(false);
        setCurrentTicket("");
        setInfo("");
        setCurrentProject("");
    }

    // const complete = async() =>{
    //     const docRef = doc(db, "ticket", currentTicket);
    //     await updateDoc(docRef, {
    //         status: "Completed"
    //     })
    //     .then(() => {
    //         alert(`Ticket ${currentTicket} Completed`)
    //         setTrigger(false);
    //         setCurrentTicket("");
    //     })
    // }

    const checkClick = () =>{
        return (
            <>
            
                <p><strong>{currentTicket}:</strong> Please add completion description and photo.</p>
                <div>
        
                <form >
                <p >Completion Description</p>
                  <textarea 
                  type="text" 
                  name="completion_description" 
                  value={info.completion_description || ""} 
                  onChange={handleChange} 
                  maxLength='800' 
                  required
                  rows="3" 
                  style={{resize: "vertical"}}>
                  </textarea>
                <div>
                    <p>Images (max 6)</p>
                    <input
                     type="file"
                     id="images"
                     onChange={handleChange}
                     accept=".jpg,.png,.jpeg,.webp"
                     multiple
                     required
                    />
                </div>

                <br/>
                <button onClick={handleSubmit}>Submit</button>
                
                </form>
                <button onClick={cancel}>Cancel</button>
             </div>
                
                
            </>
        )
    }

    const Ticket= (ticket) => {
        return(
            <div key={ticket.id} className='ticketseperator'>
                <div className='tickets'>
                    <div className='left' onClick={()=>{navigate(`/groundteamprojectdashboard/${ticket.id}`)}}>
                        <h4>{ticket.id}</h4>
                        <div>
                            <div>
                            <li>Project Id:{ticket.data.projectid}</li>
                            <li>Ticket Type:{ticket.data.type}</li>
                            <li>Schedule Date:{ticket.data.schedule}</li>
                            <li>Description:{ticket.data.description}</li>
                            <li>Status:{ticket.data.status}</li>
                            </div>
                        </div>
                    </div>
                    <div>
                    {(ticket.data.status === 'In Progress') && completeButton(ticket.id)}
                    </div>
                </div>
            </div>
          )
    }


    return (
        <>
        <div>GroundteamProject</div>
        {filter()}
        {renderTickets()}
        {(trigger) && checkClick()}
        </>
    )
}

export default GroundteamProject