import React from "react";
import HomeFooter from "../Homepage/Footer/HomeFooter";
import { useLocation } from 'react-router-dom';

const Layout =(props)=> {

  const location = useLocation();
  const showFooter = location.pathname === '/';
    return (      
      <>
        {/*<Navbar/>*/}
        
          
          <div>{props.children}</div>
          
          {showFooter && <HomeFooter />}
        
       
      </>
    );
  }


export default Layout;
