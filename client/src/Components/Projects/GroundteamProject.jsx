import React, {useState, useEffect} from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { query, collection, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const GroundteamProject = () => {
    const auth = getAuth();
    const [tickettype, setTickettype] = useState("All");
    const [selectstatus, setSelectstatus] = useState("In Progress");

    const filter = () => {
        return (
            <div>
                <label>filter:</label>
                <select value={tickettype} onChange={(e) => setTickettype(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Installation">Installation</option>
                    <option value="Maintenance">Maintenance</option>
                </select>
                <select value={selectstatus} onChange={(e) => setSelectstatus(e.target.value)}>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
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
    
    
    const renderTickets = () => {
        let detail = tdetail;
        if (selectstatus === 'In Progress'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.data.status === 'In Progress')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.data.type === 'Installation')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.data.type === 'Maintenance')
            }
        }else if (selectstatus === 'Completed'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.data.status === 'Completed')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.data.type === 'Installation')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.data.type === 'Maintenance')
            }
        }
        if (detail.length === 0){
            return <p>No tickets</p>
        }
        return detail.map(ticket => (
            // Ticket(ticket) 
            <div key={ticket.id} className='ticketseperator'>
                <div className='tickets'>
                    <div className='left'>
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
          ));
    }

    const completeButton = (ticketId) => {
        return <button key={ticketId} onClick={() => handleCompletion(ticketId)}>Complete</button>
    }

    const [trigger, setTrigger] = useState(false);
    const [currentTicket, setCurrentTicket] = useState('');

    const handleCompletion = (ticketId) => {
        setTrigger(true);
        setCurrentTicket(ticketId);
    }

    const cancel = () => {
        setTrigger(false);
        setCurrentTicket("");
    }

    const complete = async() =>{
        const docRef = doc(db, "ticket", currentTicket);
        await updateDoc(docRef, {
            status: "Completed"
        })
        .then(() => {
            alert(`Ticket ${currentTicket} Completed`)
            setTrigger(false);
            setCurrentTicket("");
        })
    }

    const checkClick = () =>{
        return (
            <>
                <p>Complete this project?</p>
                <button onClick={complete}>Yes</button>
                <button onClick={cancel}>Cancel</button>
            </>
        )
    }

    const Ticket= (ticket) => {
        return(
            <div key={ticket.id} className='ticketseperator'>
                <div className='tickets'>
                    <div className='left'>
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