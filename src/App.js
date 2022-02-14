import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Main from "./Components/Admin/Main";
import NewPost from "./Components/Admin/NewPost";
import HomeOne from "./Components/Admin/Home";
import Recent from "./Components/Admin/Recent";
import CustomPost from "./Components/Admin/CustomPost";
import Login from "./Components/Login/Login";

const App = () => {
  return (
    <Router>
      <Routes >
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/admin" element={<Main />}>
          <Route path="/admin/allPosts" element={<HomeOne />}></Route>
          <Route path="/admin/newPost" element={<NewPost />}></Route>
          <Route path="/admin/recent" element={<Recent />}></Route>
          <Route path="/admin/customPost" element={<CustomPost />}></Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
