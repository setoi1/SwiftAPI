import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SignedInContext } from "../App";

type Props = {
  children: JSX.Element;
};

export const RequireAuth = ({ children }: Props) => {
  const {signedIn} = useContext(SignedInContext);
  return signedIn ? children : <Navigate to="/login" replace />;
};

