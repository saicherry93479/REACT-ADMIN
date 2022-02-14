import React from "react";
import { Link } from "react-router-dom";
import LoginPic from "../../Assests/Images/LoginPic";

const Home = () => {
  return (
    <div>
      <h1>I am Home</h1>
      <Link to="/admin">Admin</Link>
    </div>
  );
};

export default Home;
