import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/user-context";

const RouteWithoutAcc = ({ children }: any) => {
  const { user } = useContext(UserContext);

  return <>{user.id ? <Navigate to="/" /> : children}</>;
};

export default RouteWithoutAcc;
