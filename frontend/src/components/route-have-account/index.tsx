import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";

const RouteHaveAccount = ({ children }: any) => {
  const { user } = useContext(UserContext);

  return <>{user.id ? children : <Navigate to="/signin" />}</>;
};

export default RouteHaveAccount;
