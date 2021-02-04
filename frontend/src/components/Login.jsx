import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { userContext } from "../App";

const Login = () => {
  const history = useHistory();
  const [_user, setUser] = useContext(userContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    const result = await (await fetch('http://localhost:4000/login' , {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })).json();

    if(result.accesstoken){
      setUser({
        accesstoken: result.accesstoken,
        email,
      })
      history.push('/')
    } else {
      console.log(result.error)
    }

  };

  // useEffect(()=>{
  //   console.log(user)
  // },[user])

  const handleChange = (e) => {
    if (e.currentTarget.name === "email") {
      setEmail(e.currentTarget.value);
    } else {
      setPassword(e.currentTarget.value);
    }
  };
  return (
    <div className="login-wrapper">
      <form className="login-input" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          autoComplete="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
