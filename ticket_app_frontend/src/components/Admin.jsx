import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

const Admin = () => {
  const [token, setToken] = useState(sessionStorage.getItem("userToken"));
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [userRole, setUserRole] = useState(sessionStorage.getItem("role"));
  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  return (
    <>
      <Dashboard
        token={token}
        username={username}
        userId={userId}
        role={userRole}
      />
    </>
  );
};
export default Admin;
