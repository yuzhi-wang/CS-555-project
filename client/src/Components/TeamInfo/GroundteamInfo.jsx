import React, {useState, useEffect} from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { query, collection, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const GroundteamInfo = () => {
    const auth = getAuth();
    const [idetail, setIdetail] = useState([])
    useEffect(() => {
        const fetchInfo = async () => {
            if (auth.currentUser){
                let arr = []
                const q = query(collection(db, "GroundteamInfo"), where("GroundteamId", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    arr.push({id:doc.id, data: doc.data()});
                });
            setIdetail(arr);
            }
        };
        fetchInfo();
        
      }, []);
 
    
    const renderInfo = () => {
        let detail = idetail;
        
        if (detail.length === 0){
            let s = <div>
            <p>No Information</p>
            <button type="button" className="btn btn-danger btn-m" onClick={CreatePage}>Create Information</button>
            </div>
            return s; 
            
        }
        // console.log(idetail)
        return detail.map(info => (
            
            <div key={info.id} >
                <div className='infor'>
                    <div className='left'>
                        {/* <h4>{info.id}</h4> */}
                        <div>
                            <div>
                            
                            <p><strong>Company Information:</strong></p><p> {info.data.CompanyInfo}</p>
                            <p><strong>Team Members:</strong></p><p>{info.data.Members}</p>
                            <p><strong>Contact Number: </strong>{info.data.ContactNumber}</p>
                            <button type="button" className="btn btn-danger btn-m" onClick={EditPage}>Edit</button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
          ));
    }
    
    const EditPage = () => {
        window.location.replace('/groundteamdashboard/infoedit');
    };
    const CreatePage = () => {
        window.location.replace('/groundteamdashboard/infocreate');
    };
    return (
        <>
        <div>GroundteamInformation</div>
        {renderInfo()}
      
        </>
    )
}
export default GroundteamInfo