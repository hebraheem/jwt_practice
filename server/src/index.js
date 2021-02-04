require("dotenv/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const { isAuth } = require("./isAuth");

const { fakedb } = require("./fakedb");
const {
  createRefreshToken,
  createAccessToken,
  sendAccessToken,
  sendRefreshToken,
} = require("./token");

const server = express();

//Use express middleware for easier cookie handling;
server.use(cookieParser());

server.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//Needed to read body data;
server.use(express.json()); // to support JSON-encoded bodies;
server.use(express.urlencoded({ extended: true })); //support url-encoded bodies;

//1. Register user
server.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    //1.check if user exist;
    const user = fakedb.find((user) => user.email === email);
    if (user) throw new Error("user already exist");
    //2. if user exist hash the password;
    const hashPassword = await hash(password, 10);
    //3. insert it to the fakedb;
    fakedb.push({
      id: fakedb.length,
      email,
      password: hashPassword,
    });
    res.send({ message: "user created" });
    console.log(fakedb);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

//2.Login user
server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //find user in fakedb;
    const user = fakedb.find((user) => user.email === email);
    if (!user) throw new Error("user does not exist");
    //compare if the password matches
    const valid = await compare(password, user.password);
    if (!valid) throw new Error("passord not correct");
    //if correct, create refresh and access token;
    const accesstoken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    // puy the refresh token in fakedb
    user.refreshToken = refreshToken;
    //send refreshtoken as a cookie and accesstoken as regular response
    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, req, accesstoken);
    //console.log(fakedb);
  } catch (error) {
    res.send({
      error: `${error.message}`,
    });
  }
});

//3.Logout user
server.post("/logout", (_req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh_token" });
  return res.send({
    message: "logged out",
  });
});

//setup a protected route;
server.post("/protected", async (req, res) => {
  try {
    const userId = isAuth(req);
    if (userId !== null) res.send({ data: "this is protected data" });
  } catch (error) {
    res.send({
      message: `${error.message}`,
    });
  }
});

//get new access token with a refresh token;
server.post("/refresh_token", (req, res) => {
  const token = req.cookies.refreshtoken;
  //if we dont have a token in out reques
  if (!token) {
    return res.send({ accesstoken: "" });
  }
  //if we have access token
  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.send({
      accesstoken: "",
    });
  }
  //token is valid, check if user exist;
  const user = fakedb.find(user => user.id === payload.userId);
  if (!user) {
    return res.send({ accesstoken: "" });
  }
  //user exist, check if refreshtoken exist on user;
  if (user.refreshToken !== token) {
      //console.log(user.refreshToken);
    return res.send({ accesstoken: "" });
  }

  //token exist, create new refreshtoken and accesstoken;
  const accesstoken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  user.refreshToken = refreshToken;
  //send new refreshtoken and accesstoken
  sendRefreshToken(res, refreshToken);
  return res.send({ accesstoken });
});

server.listen(process.env.ACCESS_PORT, () => {
  console.log(`Sever listening on port ${process.env.ACCESS_PORT}`);
});
