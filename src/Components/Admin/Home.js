import { Button, TextField } from "@mui/material";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  serverTimestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RecentIcon from "../../Assests/Images/RecentIcon";
import { bottomTabs } from "../../Assests/Utils";
import { db } from "../Firebase/Firebase";
import "./Home.css";
import PostOne from "./PostOne";
const Home = () => {
  const [loadSoinner, setLoadSoinner] = useState(false);
  const [deleteid, setDeleteId] = useState(null);
  const [showDailog, setShowDailog] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [data, setData] = useState([]);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [lastDataLength, setLastDataLength] = useState(0);
  const [filter, setFilter] = useState("All");
  // useState(async () => {
  //   console.log("in useeffect in recent");

  //   const queryRef = collection(db, "designs");
  //   const q = query(queryRef, orderBy("timestamp"), limit(10));
  //   const querySnapshot = await getDocs(q);
  //   var dataUpload = [];
  //   querySnapshot.docs.map((doc, index) => {
  //     dataUpload.push({ ...doc.data(), id: doc.id });
  //   });
  //   console.log("dataUpload is ", dataUpload, " at ");
  //   setData([...dataUpload]);
  // }, []);
  useEffect(() => {
    console.log("enterd the data useeffect ");
    if (data.length > 0) {
      console.log("data is changed  and length  is > 0  ", data.length);
      console.log("data length is > 0 data is ", data);
      setLastDataLength(data.length);
      console.log("lastDataLength is ", lastDataLength);

      if (data.length % 10 === 0) {
        setLoadMore(true);
        setLastTimestamp(data[data.length - 1].timestamp);
      } else if (data.length % 10 > 0) {
        setLoadMore(false);
      }
      if (data.length === lastDataLength) {
        setLoadMore(false);
      }
    }
  }, [data]);
  useEffect(async () => {
    if (filter !== "All") {
      console.log("filter is not all");
      console.log("filter is ", filter);
      const queryRef = collection(db, "designs");
      const q = query(
        queryRef,
        where("designCategory", "==", filter),
        orderBy("timestamp"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      var dataUpload = [];
      querySnapshot.docs.map((doc, index) => {
        dataUpload.push({ ...doc.data(), id: doc.id });
      });
      console.log("dataUpload is  in filter ", dataUpload, " at ");
      setLastDataLength(0);
      setData([...dataUpload]);
    } else if (filter === "All") {
      const queryRef = collection(db, "designs");
      const q = query(queryRef, orderBy("timestamp"), limit(10));
      const querySnapshot = await getDocs(q);
      var dataUpload = [];
      querySnapshot.docs.map((doc, index) => {
        dataUpload.push({ ...doc.data(), id: doc.id });
      });
      console.log("dataUpload is filter all ", dataUpload, " at ");
      setLastDataLength(0);
      setData([...dataUpload]);
    }
  }, [filter, deleted]);
  useEffect(() => {
    setShowDailog(false);
    setLoadSoinner(false);
  }, [data]);
  const deleteHandler = () => {
    console.log("in deltee handler");
    console.log("deleteid is ", deleteid);
    const docRef = doc(db, "designs", deleteid);
    setLoadSoinner(true);

    deleteDoc(docRef)
      .then(() => {
        console.log("deleted sucessfully ");
        setDeleted((p) => !p);
      })
      .catch((err) => {
        console.log("unable to delete  error is ", err);
        setNotFound(true);
      });
  };

  const loadMoreHandler = async () => {
    console.log("clicked load more ");
    const queryRef = collection(db, "designs");
    console.log("lastTimestamp is in load more handler ", lastTimestamp);
    var q;
    if (filter === "All") {
      q = query(
        queryRef,
        where("timestamp", ">", lastTimestamp),
        orderBy("timestamp"),
        limit(10)
      );
    } else {
      q = query(
        queryRef,
        where("timestamp", ">", lastTimestamp),
        where("designCategory", "==", filter),
        orderBy("timestamp"),
        limit(10)
      );
    }
    const querySnapshot = await getDocs(q);
    var dataUpload = [];
    querySnapshot.docs.map((doc, index) => {
      dataUpload.push({ ...doc.data(), id: doc.id });
    });
    console.log("data upload in loadMoreHandler is ", dataUpload);
    setData((P) => [...P, ...dataUpload]);
  };

  return (
    <div className="allPosts">
      {showDailog ? (
        <div className="customSearch_Recent">
          {loadSoinner ? (
            <div className="spinTop">
              <div className="spin"></div>
            </div>
          ) : (
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
        <>
          <div className="allPosts_Header">
            <h2>Designs </h2>
            <select
              name="ageGroup"
              id="ageGroup"
              value={filter}
              style={{
                width: "50px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                outline: "none",
                borderRadius: "10px",
                justifyContent: "space-around",
                marginRight: "50px",
              }}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            >
              <option value="All">All</option>
              <option value="Kids">Kids</option>
              <option value="Teen">Teen</option>
              <option value="Adult">Adult</option>
            </select>
          </div>
          <div className="allPosts_Hero">
            <div className="allPOsts_Hero_Footer">
              <div className="allPosts_Hero_Footer_Cards">
                {data.map((item, index) => (
                  // <h2 key={index}>{item.designName}</h2>
                  <PostOne
                    data={item}
                    key={index}
                    setShowDailog={setShowDailog}
                    setDeleteId={setDeleteId}
                  />
                ))}
              </div>
              {loadMore ? (
                <Button varient="outlined" onClick={loadMoreHandler}>
                  Load more Designs
                </Button>
              ) : (
                <p></p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

// const queryRef = collection(db, "designs");
// const q = query(
//   queryRef,
//   where("timestamp", ">", lastTimestamp),
//   orderBy("timestamp"),
//   limit(10)
// );
// const querySnapshot = await getDocs(q);
// var dataUpload = [];
// querySnapshot.docs.map((doc, index) => {
//   dataUpload.push({ ...doc.data(), id: doc.id });
// });
// setData((P) => [...P, ...dataUpload]);
