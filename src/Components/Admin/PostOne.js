import React, { useContext, useState } from "react";
import DeleteIcon from "../../Assests/Images/DeleteIcon";
import EditIcon from "../../Assests/Images/EditIcon";
import "./PostOne.css";
import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { MainContext } from "./Main";
import CopyIcon from "../../Assests/Images/CopyIcon";
const PostOne = ({ data, setShowDailog, setDeleteId }) => {
  const [copied, setCopied] = useState(false);
  const value = useContext(MainContext);
  const deleteHandler = () => {
    setDeleteId(data.id);
    setShowDailog(true);
  };
  const copyHandler = async () => {
    console.log("clicked on copy icon");
    var textField = document.createElement("textarea");
    textField.innerText = data.id;
    document.body.appendChild(textField);
    textField.select();
    try {
      document.execCommand("copy");
      console.log("copied sucessfully");
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 500);
    } catch (err) {
      console.log("copy is not working ");
      setCopied(false);
    }
    textField.remove();
  };
  return (
    <div className="postone">
      <div className="top">
        <img
          src={data.photos[0].imageUrl}
          style={{ height: "300px", width: "100%", objectFit: "contain" }}
        ></img>
      </div>
      <div className="bottom">
        <div className="bottom_Top">
          <div className="bottom_Top_Header">
            <h3>{data.designName}</h3>
            <div>
              <div className="icon">
                <Link
                  to="/admin/customPost"
                  state={{ dataLink: data }}
                  onClick={() => value.setActive(4)}
                >
                  <EditIcon color="green" />
                </Link>
              </div>
              <div className="icon" onClick={deleteHandler}>
                <DeleteIcon />
              </div>
            </div>
          </div>
        </div>
        <div className="bottom_Description">
          <p>{data.designDescription}</p>
        </div>
        <div className="bottom_Bottom">
          <h3>{data.id}</h3>
          <div onClick={copyHandler}>
            {copied ? (
              <>
                <CopyIcon color="green" />
                <p style={{ color: "green", fontSize: "10px" }}>copied</p>
              </>
            ) : (
              <CopyIcon />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOne;
