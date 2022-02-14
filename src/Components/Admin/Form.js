import { Button, TextareaAutosize, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState, useContext } from "react";
import { MainContext } from "./Main";
import { dummyData } from "../../Assests/Utils";
import { db } from "../Firebase/Firebase.js";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
// import { UploadImage } from "../Firebase/UploadImage";
import AddMedia from "./AddMedia";

import { useNavigate } from "react-router-dom";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../Firebase/Firebase.js";
import "./Form.css";
import { SeeRandom } from "../../Assests/Utils/SeeRandom";
// import { TextField } from "@mui/material/TextField";
const Form = ({ post, data = [] }) => {
  const value = useContext(MainContext);
  const navigate = useNavigate();

  const classes = useStyles();
  const [photos, setPhotos] = useState([]);

  const [video, setVideo] = useState([]);
  const [designName, setDesignName] = useState("");
  const [designPopular, setDesignPopular] = useState("No");
  const [designDescription, setDesignDescription] = useState("");
  const [designPrice, setDesignPrice] = useState("");
  const [designCategory, setDesignCategory] = useState("Kids");
  const [formErrors, setFormErrors] = useState({
    nameLength: false,
    descriptionLength: false,
    priceLength: false,
    priceFormat: false,
    photoLength: false,
  });
  const [uploadPhotoError, setUploadPhotoError] = useState(false);
  const [uploadVideoError, setUploadVideoError] = useState(false);
  // const [uploadingError, setUploadingError] = useState(false);

  // firebase Things useStates #######################################################
  const [uploadPhotos, setUploadPhotos] = useState([]);
  const [uploadVideo, setUploadVideo] = useState([]);
  const [uploadingError, setUploadingError] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadStart, setUploadStart] = useState(false);

  const [fireStorePresent, setFireStorePresent] = useState(false);

  // update form useState #############################################################

  useEffect(() => {
    if (post === "update" && data.length > 0) {
      console.log("data is in form update  ", data);
      setDesignName(data[0].designName);
      setDesignDescription(data[0].designDescription);
      setDesignPrice(data[0].designPrice);
      setDesignPopular(data[0].designPopular);
      setDesignCategory(data[0].designCategory);
      console.log("photos are ", data[0].photos);
      console.log("video is ", data[0].video);
      var photos = [];
      data[0].photos.forEach((element) => {
        photos.push({ ...element, update: "yes" });
      });
      setPhotos(photos);
      setVideo(
        data[0].video !== null ? [{ ...data[0].video, update: "yes" }] : []
      );
      // [{ ...data[0].video, update: "yes" }];
    }
  }, []);

  // ###### useEffect ##################################################################

  // useEffect without args is called when the component is mounted ###################
  useEffect(() => {
    console.log("value actve is ", value.active);
  }, []);

  // firebase Things useEffects #######################################################

  useEffect(() => {
    if (uploaded === true) {
      navigate("/admin/recent");
      value.setActive(2);
    }
  }, [uploaded]);

  // image useeffect #######################################################

  useEffect(() => {
    // ######################################################################################
    console.log("changes in uploadPhotos");
    console.log("upload Photos length is ", uploadPhotos.length);
    if (uploadPhotos.length > 0) {
      console.log("photos reached upload photos are ", uploadPhotos.length);
    }

    if (uploadPhotos.length === photos.length && photos.length > 0) {
      console.log("upload photos are reached to photos length");
      var b = uploadPhotos.filter((item) => item.error === true);
      if (b.length > 0) {
        setUploadPhotoError(true);
        setUploadStart(false);
      } else if (b.length === 0) {
        console.log("no error in photos ready to proceed to videos");
        setUploadPhotoError(false);

        if (video.length > 0) {
          console.log("there are videos to upload ");
          videoUploader(video[0], video[0].id);
        } else if (video.length === 0) {
          var photosToUpload = [];
          uploadPhotos.forEach((item) => {
            photosToUpload.push({ id: item.idMe, imageUrl: item.url });
          });
          const data = {
            designName: designName,
            designDescription: designDescription,
            designCategory: designCategory,
            designPopular: designPopular,
            designPrice: designPrice,
            photos: photosToUpload,
            video: null,
            timestamp: serverTimestamp(),
          };
          uploadToFireStore(data);
        }
      }
    }
  }, [uploadPhotos]);

  // video useeffect #######################################################
  useEffect(() => {
    // ######################################################################################
    console.log("changes in uploadVideo");
    console.log("upload Videos length is ", uploadVideo.length);
    if (uploadVideo.length > 0) {
      console.log("videos reached upload videos  are ", uploadVideo.length);
    }

    if (uploadVideo.length === video.length && video.length > 0) {
      console.log("upload video are reached tovideo length");
      console.log("upload videos are ", uploadVideo);
      if (uploadVideo[0].isError === false) {
        setUploadVideoError(false);
        var photosToUpload = [];
        uploadPhotos.forEach((item) => {
          photosToUpload.push({ id: item.idMe, imageUrl: item.url });
        });
        const data = {
          designName: designName,
          designDescription: designDescription,
          designCategory: designCategory,
          designPopular: designPopular,
          designPrice: designPrice,
          photos: photosToUpload,
          video: { id: uploadVideo[0].idMe, imageUrl: uploadVideo[0].url },
          timestamp: serverTimestamp(),
        };
        uploadToFireStore(data);
      } else if (uploadVideo[0].isError === true) {
        setUploadVideoError(true);
        setUploadStart(false);
      }
    }
  }, [uploadVideo]);

  // ######################################################################################

  useEffect(() => {
    if (photos.length >= 2) {
      setFormErrors({ ...formErrors, photoLength: false });
    } else if (photos.length > 0) {
      setFormErrors({ ...formErrors, photoLength: true });
    }
  }, [photos]);
  // uploadToFireStor #####################################################################

  const uploadToFireStore = async (dataFinal) => {
    console.log("enter into firestore");
    console.log("dtaa is ", dataFinal);
    const uniqueId = SeeRandom(dataFinal);
    console.log("unique id is ", uniqueId);
    dataFinal.uniqueId = uniqueId;
    console.log("data after unique id  is ", dataFinal);
    const queryRef = collection(db, "designs");
    const q = query(queryRef, where("uniqueId", "==", uniqueId));
    const querySnapshot = await getDocs(q);
    console.log("query snapshot is ", querySnapshot);

    console.log("query snapshot docs ", querySnapshot.docs);
    if (querySnapshot.docs.length > 0) {
      console.log(
        "doc is already prent in firestore ",
        querySnapshot.docs[0].data(),
        " and id ",
        querySnapshot.docs[0].id
      );
      setFireStorePresent(true);
      setUploadStart(false);
      setUploadPhotos([]);
      setUploadVideo([]);
    } else if (querySnapshot.docs.length === 0) {
      try {
        const docRef = await addDoc(collection(db, "designs"), dataFinal);
        setUploadingError(false);
        // if (docRef.id) {
        if (post === "new") {
          setUploaded(true);
          console.log("Document written with ID: ", docRef.id);
          setUploadStart(false);
        }

        if (post === "update") {
          console.log("updated was has to be deleted and id is ", data[0].id);
          const docRef = doc(db, "designs", data[0].id);
          deleteDoc(docRef)
            .then(() => {
              console.log("deleted successfully");
              setUploaded(true);
              console.log("Document written with ID: ", docRef.id);
              setUploadStart(false);
            })
            .catch((err) => {
              console.log("error in deleting ", err);
            });
        }
        // }
      } catch (e) {
        setUploadingError(true);
        setUploadStart(false);
        setUploaded(false);
        console.error("Error adding document: ", e);
      }
    }
  };

  // imageUploader #####################################################################

  const imageUploader = async (item, _id) => {
    console.log("enter into image uploader");
    if (item.update === "no") {
      console.log("item is not update   ");
      console.log("file  is in imageUploader ", item.file.name);

      const name = `images/${item.file.name}`;

      const ref = storageRef(storage, name);
      try {
        const uploadTask = await uploadBytesResumable(ref, item.file);
        console.log("uploadTask is ", uploadTask);
        const reference = uploadTask.ref;
        getDownloadURL(reference)
          .then((url) => {
            console.log("url is ", url);
            const uploadDate = {
              isError: false,
              idMe: _id,
              url: url,
              error: "",
            };
            // if (!uploadPhotos.includes(uploadDate)) {
            setUploadPhotos((p) => [...p, uploadDate]);
            // }
          })
          .catch((error) => {
            console.log("error is ", error);
            const uploadDate = {
              isError: true,
              idMe: _id,
              url: "",
              error: error,
            };
            // if (!uploadPhotos.includes(uploadDate)) {
            setUploadPhotos((p) => [...p, uploadDate]);
            // }
          });
      } catch (e) {
        const uploadDate = { isError: true, idMe: _id, url: "", error: e };
        // if (!uploadPhotos.includes(uploadDate)) {
        setUploadPhotos((p) => [...p, uploadDate]);
        // }
      }
    } else if (item.update === "yes") {
      console.log("file is already presnt url is ", item.imageUrl);
      const uploadDate = {
        isError: false,
        idMe: _id,
        url: item.imageUrl,
        error: "",
      };

      setUploadPhotos((p) => [...p, uploadDate]);
    } else {
      console.log("you fucked in image uploader");
    }
  };
  // ######################################################################################

  // Video Uploade ######################################################################################

  const videoUploader = async (item, _id) => {
    console.log("in video uploader");
    if (item.update === "no") {
      console.log("file video is not presnt url is ");
      console.log("file is in videoUploader ", item.file.name);
      const name = `videos/${item.file.name}`;
      const ref = storageRef(storage, name);
      try {
        const uploadTask = await uploadBytesResumable(ref, item.file);
        console.log("uploadTask is ", uploadTask);
        const reference = uploadTask.ref;
        getDownloadURL(reference)
          .then((url) => {
            console.log("url is ", url);
            const uploadDate = {
              isError: false,
              idMe: _id,
              url: url,
              error: "",
            };

            setUploadVideo([uploadDate]);
          })
          .catch((error) => {
            console.log("error is ", error);
            const uploadDate = {
              isError: true,
              idMe: _id,
              url: "",
              error: error,
            };
            setUploadVideo([uploadDate]);
          });
      } catch (e) {
        const uploadDate = { isError: true, idMe: _id, url: "", error: e };
        setUploadVideo([uploadDate]);
      }
    } else if (item.update === "yes") {
      console.log("file is already presnt url is ", item.imageUrl);
      const uploadDate = {
        isError: false,
        idMe: _id,
        url: item.imageUrl,
        error: "",
      };

      setUploadVideo([uploadDate]);
    }
  };
  // #######################################################################################################
  // error checker #############################################################
  const errorChecker = () => {
    let errors = {
      nameLength: false,
      descriptionLength: false,
      priceLength: false,
      priceFormat: false,
      photoLength: false,
    };
    if (designName.length < 6) {
      console.log("design Name has error ");
      errors.nameLength = true;
    } else if (designName.length >= 6) {
      console.log("design name No Error ");
    }
    if (designDescription.length < 50) {
      errors.descriptionLength = true;
      console.log("design description has error ");
    } else {
      console.log("design description No Error ");
    }
    if (designPrice.length < 1) {
      errors.priceLength = true;
      console.log("design price has length  error ");
    } else {
      console.log("design price lengh  No Error ");
    }
    if (designPrice.length > 0) {
      if (isNaN(designPrice)) {
        errors.priceFormat = true;
        console.log("design price has format error ");
      } else {
        console.log("design price format No Error ");
      }
    }
    if (photos.length < 2) {
      errors.photoLength = true;
      console.log("design photo has length  error ");
    } else if (photos.length >= 2) {
      console.log("design photolength  No Error ");
    }

    setFormErrors(errors);

    if (
      !errors.nameLength &&
      !errors.descriptionLength &&
      !errors.priceLength &&
      !errors.priceFormat &&
      !errors.photoLength
    ) {
      return true;
    } else {
      return false;
    }
  };
  //  uploadHandler #############################################################
  const uploadHandler = () => {
    console.log("clicked upload handler");
    if (errorChecker()) {
      //uploading files ################
      setUploadStart(true);
      photos.map((item) => imageUploader(item, item.id));
    } else {
      console.log("there are errors ");
    }
  };
  //  update  Handler #############################################################
  const updateHandler = () => {
    console.log("clicked update handler");
    if (errorChecker()) {
      //uploading files ################
      setUploadStart(true);
      photos.map((item) => imageUploader(item, item.id));
    } else {
      console.log("there are errors  in update handler");
    }
  };

  return (
    <div className="form">
      {uploadStart ? (
        <div className="loadingPage">
          <div className="loading" data-loading-text="Loading..."></div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="formData">
        <h2 className="formData_childrenOne_header">Add Details</h2>
        <div className="formData_childrenOne">
          <TextField
            id="outlined-basic"
            label="Name Of Design"
            variant="outlined"
            value={designName}
            onChange={(e) => {
              setDesignName(e.target.value);
              if (designName.length > 6) {
                setFormErrors({ ...formErrors, nameLength: false });
              }
            }}
            helperText={
              formErrors.nameLength ? "Name should be greater than 6" : ""
            }
            error={formErrors.nameLength}
          />
          <div></div>

          <TextField
            // placeholder="MultiLine with rows: 2 and rowsMax: 4"
            multiline
            rows={4}
            // maxRows={6}
            value={designDescription}
            variant="outlined"
            id="outlined-basic"
            label="Description"
            onChange={(e) => {
              setDesignDescription(e.target.value);
              if (designDescription.length > 50) {
                setFormErrors({ ...formErrors, descriptionLength: false });
              }
            }}
            helperText={
              formErrors.descriptionLength
                ? "Description should be greater than 50"
                : ""
            }
            error={formErrors.descriptionLength}
          />
          <div></div>
          <TextField
            id="outlined-basic"
            label="Rough Price in INR"
            variant="outlined"
            value={designPrice}
            onChange={(e) => {
              setDesignPrice(e.target.value);
              if (designPrice.length > 0) {
                setFormErrors({ ...formErrors, priceLength: false });
                if (isNaN(designPrice)) {
                  setFormErrors({ ...formErrors, priceFormat: true });
                } else {
                  setFormErrors({ ...formErrors, priceFormat: false });
                }
              }
            }}
            helperText={
              formErrors.priceFormat
                ? "please enter price in numbers"
                : "" || formErrors.priceLength
                ? "Price should be greater than 0"
                : ""
            }
            error={formErrors.priceFormat || formErrors.priceLength}
          />

          <div></div>

          <label htmlFor="ageGroup">choose a age group:</label>

          <select
            name="ageGroup"
            id="ageGroup"
            value={designCategory}
            style={{
              width: "100px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              outline: "none",
              borderRadius: "10px",
              justifyContent: "space-around",
              marginTop: "10px",
            }}
            onChange={(e) => setDesignCategory(e.target.value)}
          >
            <option value="Kids">Kids</option>
            <option value="Teen">Teen</option>
            <option value="Adult">Adult</option>
          </select>
          <div></div>

          <label htmlFor="popularGroup">Trending/Popular:</label>

          <select
            name="popularGroup"
            id="popularGroup"
            value={designPopular}
            style={{
              width: "100px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              outline: "none",
              borderRadius: "10px",
              justifyContent: "space-around",
              marginTop: "10px",
            }}
            onChange={(e) => {
              console.log("design popoular changed to ", e.target.value);
              setDesignPopular(e.target.value);
            }}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <div></div>
        </div>
        <h2 className="formData_childrenTwo_header">Add Media</h2>
        <div className="formData_childrenTwo">
          <AddMedia
            text={"photos"}
            data={photos}
            setData={setPhotos}
          ></AddMedia>
          {formErrors.photoLength ? (
            <p style={{ color: "red" }}>must include Two photos</p>
          ) : (
            <p></p>
          )}

          <AddMedia text={"videos"} data={video} setData={setVideo}></AddMedia>
        </div>
      </div>
      {uploadPhotoError ? (
        <p style={{ color: "red" }}>"error in Uploading Photos Re upload"</p>
      ) : (
        <p></p>
      )}
      {uploadVideoError ? (
        <p style={{ color: "red" }}>"error in Uploading Photos Re upload"</p>
      ) : (
        <p></p>
      )}
      {uploadingError ? (
        <p style={{ color: "red" }}>"error in Uploading Re upload"</p>
      ) : (
        <p></p>
      )}
      {fireStorePresent ? (
        <p style={{ color: "red" }}>"The design is already Present"</p>
      ) : (
        <p></p>
      )}
      <div className="formButton">
        {post === "new" ? (
          <Button variant="contained" color="primary" onClick={uploadHandler}>
            Upload
          </Button>
        ) : (
          <Button className={classes.buttonUpdate} onClick={updateHandler}>
            <span style={{ color: "white" }}>Update</span>
          </Button>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  buttonUpdate: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
    color: "white",
    width: "100px",
  },
});

export default Form;
