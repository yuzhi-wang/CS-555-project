import React, {useState, useEffect} from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { query, collection, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

const GroundteamDisapprovalProject = () => {

    const auth = getAuth();
    const [tdetail, setTdetail] = useState([])
    useEffect(() => {
        
        const fetchTicket = async () => {
            if (auth.currentUser){
                let arr = []
                const q = query(collection(db, "ticket"), where("groundteamid", "==", auth.currentUser.uid), 
                where("status", "==", "Completion Disapproved"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    arr.push({id:doc.id, data: doc.data()});
                });
            setTdetail(arr);
            }
        };
        fetchTicket();
    }, []);
    const AcknowledgedButton = (ticketId) => {
        return <button key={ticketId} onClick={() => handleAcknowledged(ticketId)}>Acknowledged</button>
    }
    async function handleAcknowledged(ticketId) {
   
        
         
          const infoRef = doc(db, "ticket", ticketId);
        
          
            await updateDoc(infoRef, {
               
                
                status: "In Progress"
 
              });
           
         
    
          
          alert("Acknowledged. Reset the status to In Progress.");
          window.location.replace('/groundteamdashboard');
        
       
      }
    const renderTickets = () => {
        let detail = tdetail;
        
        if (detail.length === 0){
            let s = <div>
            <p>No Project Disapproved</p>
            
            </div>
            return s; 
            
        }
        // console.log(idetail)
        return detail.map(ticket => (
            
            <div key={ticket.id} >
                <div className='infor'>
                    <div className='left'>
                        <h4>{ticket.id}</h4>
                        <div>
                            <div>
                            
                            <li>Project Id:{ticket.data.projectid}</li>
                            <li>Ticket Type:{ticket.data.type}</li> 
                            <li>Description:{ticket.data.description}</li>
                            <li>Status:{ticket.data.status}</li>
                            <li>Disapproval Description:{ticket.data.manager_disapproval}</li>
                            {AcknowledgedButton(ticket.id)}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        ));
    }
   
    return (
        <>
        <div>Disapproved Project</div>
        
        {renderTickets()}
        
        </>
    )


}

export default GroundteamDisapprovalProject