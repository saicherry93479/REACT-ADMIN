import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Form from "./Form";
import { useLocation } from "react-router-dom";
import "./CustomPost.css";
import { doc, getDoc, query } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
const CustomPost = ({ data = [] }) => {
  const location = useLocation();

  const [dataForm, setDataForm] = useState(data);
  const [search, setSearch] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [searchError, setSearchError] = useState(false);
  useEffect(() => {
    console.log("in useEffect in customPost");
    // console.log("outside if datalINK IS ", location.state.dataLink);
    if (location.state !== undefined && location.state !== null) {
      console.log("yes data link is presents ");
      setDataForm([location.state.dataLink]);
    }

    // if (dataLink) {
    //   console.log("dataLink prenst and datalink is  ", dataLink);
    //   setDataForm(dataLink);
    // }
  }, []);
  const searchHandler = () => {
    if (search.length === 0) {
      setSearchError(true);
    } else if (search.length > 0) {
      setSearchError(false);
      console.log("search is ", search);
      const docRef = doc(db, "designs", search);
      console.log("docRef is ", docRef);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            console.log("doc data is ", doc.data());
            setDataForm([{ ...doc.data(), id: doc.id }]);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        })
        .catch((err) => {
          console.log("doc is not present error is ", err);
          setNotFound(true);
        });
    }
  };
  return (
    <div>
      {dataForm.length > 0 ? (
        <Form post="update" data={dataForm}></Form>
      ) : (
        <div className="customSearch">
          <div>
            <TextField
              label="enter Ref id"
              variant="outlined"
              value={search}
              onChange={(e) => {
                e.preventDefault();
                setSearch(e.target.value);
              }}
              helperText={
                (notFound ? "Design not found enter correct id" : "") ||
                (searchError ? "Enter id to get Design" : "")
              }
              error={notFound || searchError}
            ></TextField>
            <div style={{ height: "30px", width: "100%" }}></div>

            <Button variant="contained" color="primary" onClick={searchHandler}>
              Get Design
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPost;
