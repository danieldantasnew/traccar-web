import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ loading, children }) => {
  const user = useSelector((state) => state.session.user);

  if (loading) return <></>;
  if (user) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
