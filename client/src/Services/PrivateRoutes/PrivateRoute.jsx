import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../useAuthStatus";
import Loading from "../../Components/Loading";
export default function PrivateRoute() {
  const { loggedIn, checkingStatus, role } = useAuthStatus();
  if (checkingStatus) {
    return <Loading />;
  }
  return loggedIn ? <Outlet role={role}/> : <Navigate to="/login" />;
}
