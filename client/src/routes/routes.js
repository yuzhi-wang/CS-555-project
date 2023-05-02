import React from "react";
import { Routes as Switch, Route as Routing, useLocation } from "react-router-dom";
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
import CustomerProjectDashboard from "../Components/ProjectDashboard/CustomerProjectDashboard";
import GroundTeamProjectDashboard from "../Components/ProjectDashboard/GroundTeamProjectDashboard";
import HomeNavigation from "../Components/Homepage/Navigation/HomeNavigation";
import HomeFooter from "../Components/Homepage/Footer/HomeFooter";





const Routesr = () => {

  return (
    <>
      <Layout>
        <Switch>
          {/* Auth Routes */}
          <Routing exact path="/" element={<HomeNavigation />}>
          <Routing index element = {<Homepage/>} />
          
          
          </Routing>
          <Routing exact path="/login" element={<Login />} />
          
          {/*
          <Routing path="/forgot-password" element={<ForgotPassword />} />

          {/*Listing Routes need to replace Sign up with Listing page*/}
         
       

          {/* Private: Only logged in user can access */}
          {/*Wrap the route with PrivateRoute component to allow access to authorised user only like done below*/}
        
          <Routing path="/customerdashboard" element={<PrivateRouteCustomer/>}>
          <Routing exact path="/customerdashboard" element={<CustomerDashboard  />} /> 
          </Routing>
          <Routing path="/customerprojectdashboard/:id" element={<PrivateRouteCustomer/>}>
          <Routing exact path="/customerprojectdashboard/:id" element={<CustomerProjectDashboard />} /> 
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
          <Routing path="/groundteamprojectdashboard/:id" element={<PrivateRouteGroundteam/>}>
          <Routing exact path="/groundteamprojectdashboard/:id" element={<GroundTeamProjectDashboard />} /> 
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
