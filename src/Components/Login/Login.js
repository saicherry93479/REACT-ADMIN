import { Button, Card, CardContent, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPic from "../../Assests/Images/LoginPic";
import "./Login.css";
const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [credentialUserNameError, setCredentialUserNameError] = useState(false);
  const [credentialPasswordError, setCredentialPasswordError] = useState(false);

  const loginHandler = () => {
    if (userName.length > 0) {
      setUserNameError(false);
      if (password.length > 0) {
        setPasswordError(false);
        setUserNameError(false);
        setPasswordError(false);
        if (userName === "design@123") {
          if (password === "design@123") {
            navigate("/admin");
          } else {
            setCredentialPasswordError(true);
          }
        } else {
          setCredentialUserNameError(true);
        }
      } else {
        setPasswordError(true);
      }
    } else {
      setUserNameError(true);
    }
  };
  return (
    <div className="login">
      <div className="loginLeft">
        <Card>
          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "40px",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "25px",
                backgroundImage:
                  "linear-gradient(90deg, rgba(9,47,121,1) 13%, rgba(2,0,36,1) 38%, rgba(0,212,255,1) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "Montserrat Alternates",
              }}
            >
              Login
            </h2>
            <TextField
              label="Username"
              style={{ marginBottom: "20px" }}
              value={userName}
              onChange={(e) => {
                e.preventDefault();

                setUserName(e.target.value);
              }}
              helperText={
                (userNameError ? "Please enter  username" : "") ||
                (credentialUserNameError ? "Invalid username" : "")
              }
              error={userNameError || credentialUserNameError}
            ></TextField>
            <TextField
              label="password"
              style={{ marginBottom: "20px" }}
              value={password}
              onChange={(e) => {
                e.preventDefault();
                setPassword(e.target.value);
              }}
              helperText={
                (passwordError ? "enter password " : "") ||
                (credentialPasswordError ? "Invalid password" : "")
              }
              error={passwordError || credentialPasswordError}
            ></TextField>
            <Button
              color="primary"
              variant="contained"
              style={{ marginBottom: "30px" }}
              onClick={loginHandler}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="loginRight">
        <h1 onClick={() => navigate("/")}>Modernss</h1>
        <div style={{ marginTop: "70px", marginLeft: "40px" }}>
          <LoginPic />
        </div>
      </div>
    </div>
  );
};

export default Login;
