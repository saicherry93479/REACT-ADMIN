import React, { useEffect, useLayoutEffect, useState } from "react";
import { db } from "../Firebase/Firebase.js";

import "./Recent.css";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import PostOne from "./PostOne.js";
import { Button, TextField } from "@mui/material";
const Recent = () => {
  const [data, setData] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [deleteid, setDeleteId] = useState(null);
  const [showDailog, setShowDailog] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loadSoinner, setLoadSoinner] = useState(true);
  // const [searchError, setSearchError] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setShowDailog(false);
    setLoadSoinner(false);
  }, [data]);

  useEffect(async () => {
    console.log("in useeffect in recent");
    // if (deleteid !== null) {
    const queryRef = collection(db, "designs");
    const q = query(queryRef, orderBy("timestamp", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    var dataUpload = [];
    querySnapshot.docs.map((doc, index) => {
      dataUpload.push({ ...doc.data(), id: doc.id });
    });
    setData(dataUpload);

    // }

    // return querySnapshot;
  }, [deleted]);
  // const searchHandler = () => {
  //   setNotFound(false);
  //   if (search.length === 0) {
  //     setSearchError(true);
  //     setShowDailog(false);
  //   } else if (search.length > 0) {
  //     setSearchError(false);
  //     console.log("search is ", search);
  //     deleteHandler();
  //   }
  // };
  const deleteHandler = () => {
    console.log("in deltee handler");
    console.log("deleteid is ", deleteid);
    setLoadSoinner(true);
    const docRef = doc(db, "designs", deleteid);

    deleteDoc(docRef)
      .then(() => {
        console.log("deleted sucessfully ");
        setDeleted((p) => !p);
        // setShowDailog(false);
      })
      .catch((err) => {
        console.log("unable to delete  error is ", err);
        setNotFound(true);
      });
  };
  useEffect(() => {
    console.log("data useEffect");
    if (data.length > 0) {
      console.log("data is changed  and length is ", data.length);
      console.log("data length is > 0 data is ", data);
    }
  }, [data]);
  return (
    <div className="recent">
      {showDailog ? (
        <div className="customSearch_Recent">
          {loadSoinner ? (
            <div className="spinTop">
              <div className="spin"></div>
            </div>
          ) : (
            // </div>
            <></>
          )}
          <div className="customeSearch_Inner">
            <TextField
              label="enter Ref id"
              variant="outlined"
              value={deleteid}
              // onChange={(e) => {
              //   e.preventDefault();
              //   setSearch(e.target.value);
              // }}
              helperText={
                notFound ? "Design not found enter correct id" : ""
                // (searchError ? "Enter id to get Design" : "")
              }
              error={notFound}
            ></TextField>
            <div style={{ height: "30px", width: "100%" }}></div>
            <div>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowDailog(false)}
              >
                cancel
              </Button>
              <span style={{ marginLeft: "20px" }}></span>
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteHandler}
              >
                delete
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // <></>

        <>
          <div className="recentHeader">
            <h2>Recent Designs</h2>
          </div>
          <div className="recentHero">
            {data.map((item, index) => (
              <PostOne
                data={item}
                key={index}
                setShowDailog={setShowDailog}
                setDeleteId={setDeleteId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recent;
