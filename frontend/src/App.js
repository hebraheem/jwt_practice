import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Switch, useHistory } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import DashBoard from "./components/DashBoard";

export const userContext = React.createContext([]);

function App() {
  const history = useHistory()
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const logOutCallBack = async () => {
    await fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include'
    })
    //clear user from context
    setUser({});
    history.push('/')
  };


  //get new accesstoken if refreshtoken exist
  useEffect(() => {
    async function checkRefreshToken() {
      const result = await (await fetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include',
        heeders: {
          'Content-Type': 'application.json'
        }
      })).json();
      setUser({
        accesstoken: result.accesstoken,
      });
      setLoading(false);
    }
    checkRefreshToken()
  }, [])


  if(loading) return <div>Loading....</div>
  return (
    <userContext.Provider value={[user, setUser]}>
      <div className="app">
        <Navbar logOutCallBack={logOutCallBack} />
        <Switch>
          <Route exact path="/" component={DashBoard} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
        </Switch>
      </div>
    </userContext.Provider>
  );
}

export default App;
