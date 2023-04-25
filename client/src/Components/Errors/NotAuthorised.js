import React from "react";
import { Link, useNavigate } from "react-router-dom";




const NotAuthorised=({role})=>{
    console.log(role)
    const navigate = useNavigate();
    
    function goBack() {
       if(role === "customer") navigate("/customerdashboard")
       if(role === "manager") navigate("/managerdashboard")
       if(role === "groundteam") navigate("/groundteamdashboard")
       if(role === "sales") navigate("/salesdashboard")
      }

     

    return(
        
        <div className="card posE" >
            <h1>You are not Authorised to view this page</h1>
            <h2>You are assigned role: {role}</h2>
            <h3>No worries. lets get you back!!</h3>
            <button type="button" className="btn btn-danger btn-m" onClick={goBack}>Click here</button>
            <br/>
            <h3> OR Login to the authorised account</h3>
            <button type="button" className="btn btn-danger btn-m" onClick={()=>{navigate("/login")}}>Login</button>
           </div>
    )
}
export default NotAuthorised;