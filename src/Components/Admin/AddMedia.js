import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import NewPostIcon from "../../Assests/Images/NewPostIcon";
import { dummyData, leftIcon, rightIcon } from "../../Assests/Utils";
import "./AddMedia.css";

const AddMedia = ({ text, data, setData }) => {
  const [active, setActive] = useState(data.length);

  useEffect(() => {
    console.log("active changed to ", active);
  }, [active]);
  useEffect(() => {
    console.log("data changed ");
    console.log("data   in  add media ", data);
    console.log("data length is ", data.length);

    setActive(data.length);
  }, [data]);

  const fileChangeHandler = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    const dataItemFinal = {
      id: data.length + 1,
      file: e.target.files[0],
      imageUrl: url,
      update: "no",
    };
    if (data.length < 4 && text === "photos") {
      // var b = [];
      // b = data.filter((item) => item === dataItemFinal);
      // if (b.length === 0) {
      setData([...data, dataItemFinal]);
      // }
    } else if (data.length < 1 && text === "videos") {
      setData([dataItemFinal]);
    }
  };
  const videoRemoveHandler = () => {
    setData([]);
  };
  const photoRemoveHandler = () => {
    console.log("active is ", active);
    var b = [];
    data.forEach((item, index) => {
      if (item.id < active) {
        b.push(item);
      }
      if (item.id > active) {
        const itemData = {
          id: item.id - 1,
          file: item.file ? item.file : "update",
          imageUrl: item.imageUrl,
          update: item.update === "yes" ? "yes" : "no",
        };
        b.push(itemData);
      }
    });
    console.log("b is ", b);
    setData([...b]);
    setActive(active);
  };
  return (
    <div className="addMedia">
      <h2>Add {text}</h2>
      <div className="addMedia_hero">
        <div className="addMedia_hero_left">
          {((text === "photos" && data.length < 4) ||
            (text == "videos" && data.length < 1)) && (
            <div className="upload-btn-wrapper">
              <div className="addMedia_hero_left_childrenOne ">
                <NewPostIcon color="rgb(10, 120, 194)" />
              </div>
              <input
                type="file"
                name="myfile"
                id="myfile"
                accept={
                  text === "photos" ? ".png,.jpeg,.jpg,.jfif" : ".mp4,.mkv"
                }
                onChange={fileChangeHandler}
              />
            </div>
          )}
          {text === "photos" && data.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={photoRemoveHandler}
            >
              Remove Photo
            </Button>
          )}
          {text === "videos" && data.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={videoRemoveHandler}
            >
              Remove Video
            </Button>
          )}
        </div>
        <div className="addMedia_hero_right">
          <div
            className="addMedia_hero_right_icon"
            onClick={() => setActive((p) => p - 1)}
          >
            {active > 1 && text === "photos" && leftIcon.active()}
          </div>
          {text === "photos"
            ? data.length > 0 && (
                <div className="addMedia_hero_image">
                  {data.map(
                    (item, index) =>
                      active === item.id && (
                        <img
                          key={index}
                          src={item.imageUrl}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "contain",
                          }}
                        ></img>
                      )
                  )}
                </div>
              )
            : data.length > 0 && (
                <div>
                  <video
                    style={{
                      height: "30vh",
                      width: "300px",
                      backgroundColor: "black",
                    }}
                    controls
                  >
                    <source src={data[0].imageUrl} type="video/mp4"></source>
                    <source src={data[0].imageUrl} type="video/ogg"></source>
                  </video>
                </div>
              )}

          <div
            className="addMedia_hero_right_icon"
            onClick={() => setActive((p) => p + 1)}
          >
            {active < data.length &&
              data.length > 1 &&
              text === "photos" &&
              rightIcon.active()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedia;
