import React, { useEffect, useState, createContext } from "react";
import "./Main.css";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { bottomTabs } from "../../Assests/Utils";

export const MainContext = createContext();
const Main = () => {
  const [active, setActive] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = navigate("/admin/allPosts");
    return unsubscribe;
  }, []);

  const bottomMenu = () => {
    return (
      <div className="adminTop_childrenTwo_small">
        <div className="adminTop_childrenTwo_small_menu">
          {bottomTabs.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActive(item.id);
                if (item.id === 5) {
                  navigate("/");
                }
              }}
            >
              <Link to={item.to}>
                {active === item.id
                  ? item.tabIconActive()
                  : item.tabIconInActive()}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="adminTop">
      <div className="adminTop_childrenOne">
        <span>M</span>
        <span>o</span>
        <span>d</span>
        <span>r</span>
        <span>e</span>
        <span>n</span>
        <span>s</span>
        <span>s</span>
      </div>
      {/* bottom menu */}
      {bottomMenu()}

      <div className="adminTop_childrenTwo">
        <div>
          <Link
            to="/admin/allPosts"
            className="adminTop_childrenTwo_link"
            style={{
              color: active === 1 ? "white" : "rgba(255, 255, 255, 0.5)",
            }}
            onClick={() => setActive(1)}
          >
            All Posts
          </Link>
        </div>
        <div>
          <Link
            to="/admin/recent"
            className="adminTop_childrenTwo_link"
            style={{
              color: active === 2 ? "white" : "rgba(255, 255, 255, 0.5)",
            }}
            onClick={() => setActive(2)}
          >
            Recent
          </Link>
        </div>
        <div>
          <Link
            to="/admin/newPost"
            className="adminTop_childrenTwo_link"
            style={{
              color: active === 3 ? "white" : "rgba(255, 255, 255, 0.5)",
            }}
            onClick={() => setActive(3)}
          >
            new Post
          </Link>
        </div>
        <div>
          <Link
            to="/admin/customPost"
            className="adminTop_childrenTwo_link"
            style={{
              color: active === 4 ? "white" : "rgba(255, 255, 255, 0.5)",
            }}
            onClick={() => setActive(4)}
          >
            customPost
          </Link>
        </div>
        <div>
          <h3
            className="adminTop_childrenTwo_link"
            style={{
              color: active === 5 ? "white" : "rgba(255, 255, 255, 0.5)",
            }}
            onClick={() => {
              setActive(5);
              navigate("/");
            }}
          >
            Logout
          </h3>
        </div>
      </div>
      <div className="adminTop_childrenThree">
        <MainContext.Provider value={{ active, setActive }}>
          <Outlet />
        </MainContext.Provider>
      </div>
    </div>
  );
};

export default Main;
