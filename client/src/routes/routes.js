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
import Login from "../Components/Login/Login";
import CustomerDashboard from "../Components/Dashboard/CustomerDashboard/CustomerDashboard";
import ManagerDashboard from "../Components/Dashboard/ManagerDashboard/ManagerDashboard";
import GroundteamDashboard from "../Components/Dashboard/GroundteamDashboard/GroundteamDashboard";
import GroundteamInfoEdit from "../Components/TeamInfo/GroundteamInfoEdit";
import GroundteamInfoCreate from "../Components/TeamInfo/GroundteamInfoCreate";
import SalesDashboard from "../Components/Dashboard/SalesDashboard/SalesDashboard";
import PrivateRoute from "../Services/PrivateRoutes/PrivateRoute";
import PrivateRouteCustomer from "../Services/PrivateRoutes/PrivateRouteCustomer";
import PrivateRouteGroundteam from "../Services/PrivateRoutes/PrivateRouteGroundteam";
import PrivateRouteManager from "../Services/PrivateRoutes/PrivateRouteManager";
import PrivateRouteSales from "../Services/PrivateRoutes/PrivateRouteSales";
import SalesMessaging from "../Components/Messaging/SalesMessaging";
import SalesProjectDashboard from "../Components/ProjectDashboard/SalesProjectDashboard";
import ManagerProjectDashboard from "../Components/ProjectDashboard/ManagerProjectDashboard";

const Routesr = () => {
  return (
    <>
      <Layout>
        <Switch>
          {/* Auth Routes */}
          <Routing exact path="/" element={<Homepage />} />
          
          <Routing exact path="/login" element={<Login />} />
          {/*
          <Routing path="/forgot-password" element={<ForgotPassword />} />

          {/*Listing Routes need to replace Sign up with Listing page*/}
         
       

          {/* Private: Only logged in user can access */}
          {/*Wrap the route with PrivateRoute component to allow access to authorised user only like done below*/}
        
          <Routing path="/customerdashboard" element={<PrivateRouteCustomer/>}>
          <Routing exact path="/customerdashboard" element={<CustomerDashboard  />} /> 
          </Routing>
          <Routing path="/managerdashboard" element={<PrivateRouteManager/>}>
          <Routing exact path="/managerdashboard" element={<ManagerDashboard  />} /> 
          </Routing>
          <Routing path="/managerprojectdashboard/:id" element={<PrivateRouteManager/>}>
          <Routing exact path="/managerprojectdashboard/:id" element={<ManagerProjectDashboard />} /> 
          </Routing>
          <Routing path="/groundteamdashboard" element={<PrivateRouteGroundteam/>}>
          <Routing exact path="/groundteamdashboard" element={<GroundteamDashboard  />} /> 
          <Routing exact path="/groundteamdashboard/infoedit" element={<GroundteamInfoEdit  />} /> 
          <Routing exact path="/groundteamdashboard/infocreate" element={<GroundteamInfoCreate  />} /> 
          </Routing>
          <Routing path="/salesdashboard" element={<PrivateRouteSales/>}>
          <Routing exact path="/salesdashboard" element={<SalesDashboard  />} /> 
          </Routing>
          <Routing path="/salesmessaging/:id" element={<PrivateRouteSales/>}>
          <Routing exact path="/salesmessaging/:id" element={<SalesMessaging />} /> 
          </Routing>
          <Routing path="/saleprojectdashboard/:id" element={<PrivateRouteSales/>}>
          <Routing exact path="/saleprojectdashboard/:id" element={<SalesProjectDashboard />} /> 
          </Routing>
          
          {/* Public: All can use */}
          
          <Routing exact path="*" element={<Errors />} />
        </Switch>
      </Layout> 
    </>
  );
};
export default Routesr;
