import React from "react";
import { Routes as Switch, Route as Routing } from "react-router-dom";
/*
import Dashboard from "../Components/Dashboard/Dashboard";
import Messenger from "../Components/Messenger";import CreateListing from "../Components/CreateListing/CreateListing";
import Homepage from "../Components/Homepage/Homepage";
import Login from "../Components/login/login";
import Signup from "../Components/Signup";
import ForgotPassword from "../Components/ForgotPassword/ForgotPassword";
import Layout from "../Components/layout/layout";
import Profile from "../Components/Profile/Profile";

import PrivateRoute from "../PrivateRoute";
import Errors from "../Components/Errors";
import Listing from "../Components/Listing/Listing";
import Offers from "../Components/Offers/Offers";
import Sale from "../Components/Sale/Sale";
import Rent from "../Components/Rent/Rent";
import Search from "../Components/Search/Search";
*/
import Layout from "../Components/layout/layout";
import Errors from "../Components/Errors/Errors";
import Homepage from "../Components/Homepage/Homepage";



const Routesr = () => {
  return (
    <>
      <Layout>
        <Switch>
          {/* Auth Routes */}
          <Routing exact path="/" element={<Homepage />} />
          {/*
          <Routing exact path="/login" element={<Login />} />
          <Routing exact path="/signup" element={<Signup />} />
          <Routing path="/forgot-password" element={<ForgotPassword />} />

          {/*Listing Routes need to replace Sign up with Listing page*/}
         
       

          {/* Private: Only logged in user can access */}
          {/*Wrap the route with PrivateRoute component to allow access to authorised user only like done below*/}
        {/*
          <Routing path="/dashboard" element={<PrivateRoute />}>
          <Routing exact path="/dashboard" element={<Dashboard />} /> 
          </Routing>
        
          
          {/* Public: All can use */}
          
          <Routing exact path="*" element={<Errors />} />
        </Switch>
      </Layout> 
    </>
  );
};
export default Routesr;
