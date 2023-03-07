import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../useAuthStatus";
import Loading from "../../Components/Loading";
import NotAuthorised from "../../Components/Errors/NotAuthorised";
export default function PrivateRouteManager() {
  const { loggedIn, checkingStatus, role } = useAuthStatus();

  if (checkingStatus) {
    return <Loading />;
  }
  return loggedIn && role === "manager"? <Outlet role={role}/> : <NotAuthorised role={role}/>;
}
