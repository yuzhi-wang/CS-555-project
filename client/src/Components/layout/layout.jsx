import React from "react";


const Layout =(props)=> {
    return (      
      <>
        {/*<Navbar/>*/}
        <div className="row">
          
          <div>{props.children}</div>

        </div>
       
      </>
    );
  }


export default Layout;
