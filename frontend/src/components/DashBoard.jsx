import React, { useContext } from "react";
import { userContext } from "../App";
import { Redirect } from "react-router-dom";

const Dashboard = () => {
  const [user] = useContext(userContext);

  if (!user.accesstoken) {
    return <Redirect from="" to="/login" noThrow />;
  } else {
    return (
      <div>
        <h3>{user.accesstoken && `welcome ${user.email}`}</h3>
        <h1>DashBoard</h1>
      </div>
    );
  }
};

export default Dashboard;
