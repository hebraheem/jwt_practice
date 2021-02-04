import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import { userContext } from "../App";

const SignUp = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await (
      await fetch("http://localhost:4000/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
    ).json();

    if(!result.error){
      
      history.push("/");
    } 
    console.log(result.error)
  };


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
        <h1>Register</h1>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SignUp;

