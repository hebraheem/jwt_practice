import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { userContext } from "../App";

const Navbar = ({ logOutCallBack }) => {
  const [user] = useContext(userContext);
  return (
    <ul>
      {user.accesstoken ? (
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <button onClick={logOutCallBack}> logout</button>
        </ul>
      ) : (
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Register</Link>
          </li>
          <button onClick={logOutCallBack}> logout</button>
        </ul>
      )}
    </ul>
  );
};

export default Navbar;
