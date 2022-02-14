const UploadImage = async (file, id, post) => {
  console.log(file);
  const fileName =
    post === "photo" ? `images/${file.name}` : `videos/${file.name}`;

  const stRef = storageRef(storage, fileName);

  const uploadTask = await uploadBytesResumable(stRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (error) => {
      console.log(error);
      if (post === "photo") {
        setUpoadPhotos([
          ...uploadPhotos,
          {
            idMe: id,
            error: true,
            url: "",
            error: error,
            filename: file.name,
          },
        ]);
      } else if (post === "video") {
        setUploadVideo({
          error: true,
          url: "",
          error: error,
          filename: file.name,
        });
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        console.log("url is ", url);
        if (post === "photo") {
          setUpoadPhotos([
            ...uploadPhotos,
            {
              idMe: id,
              error: false,
              url: url,
              error: "",
              filename: file.name,
            },
          ]);
        } else if (post === "video") {
          setUploadVideo({
            idMe: id,
            error: false,
            url: url,
            error: "",
            filename: file.name,
          });
        }
      });
    }
  );
};

var b = uploadPhotos.filter((item) => item.error === true);

if (b.length > 0) {
  console.log("checking photos length in upload handler greater than 0");
  setUploadPhotoError(true);
} else if (b.length === 0) {
  console.log(
    "checking photos length in upload handler equal to 0 and length is ",
    uploadPhotos.length
  );
  var photoToUpload = [];
  uploadPhotos.forEach((item) => {
    photoToUpload.push({
      id: item.idMe,
      imageUrl: item.url,
    });
  });
}
 if (video.length > 0) {
   UploadImage(video[0].file, video[0].id, "video");
   if (uploadVideo.error === true) {
     setUploadVideoError(true);
   }
 }
 import { Button, TextareaAutosize, TextField } from "@mui/material";
 import { makeStyles } from "@mui/styles";
 import React, { useEffect, useState } from "react";
 import { dummyData } from "../../Assests/Utils";
 import { db } from "../Firebase/Firebase.js";
 import { addDoc, collection } from "firebase/firestore";
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
 // import { TextField } from "@mui/material/TextField";
 const Form = ({ post, data = [] }) => {
   const [photosReached, setPhotosReached] = useState(0);
   const [videoReached, setVideoReached] = useState(0);
   const navigate = useNavigate();
   const [uploadPhotos, setUpoadPhotos] = useState([]);
   const [uploadVideo, setUploadVideo] = useState({});
   const classes = useStyles();
   const [photos, setPhotos] = useState([]);
   const [clickUpload, setClickUpload] = useState(false);

   const [video, setVideo] = useState([]);
   const [designName, setDesignName] = useState("");
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
   const [uploadingError, setUploadingError] = useState(false);
   const [uploaded, setUploaded] = useState(false);
   const [photoToUpload, setPhoToUpload] = useState([]);
   useEffect(() => {
     if (post === "update") {
       setDesignName(data.designName);
       setDesignDescription(data.designDescription);
       setDesignCategory(data.designCategory);
       setDesignPrice(data.designPrice);
       setPhotos(data.photos);
       setVideo(data.video);
     }
   }, []);

   useEffect(() => {
     if (photosReached === photos.length) {
       console.log("upload phots length", uploadPhotos.length);
       var b = uploadPhotos.filter((item) => item.error === true);
       console.log(
         "photos reached is ",
         photosReached,
         " photos lengyh is ",
         photos.length
       );
       console.log("upload photos in photoreached ", uploadPhotos);

       if (b.length > 0) {
         console.log("checking photos length in upload handler greater than 0");
         setUploadPhotoError(true);
         setClickUpload(false);
       } else if (b.length === 0) {
         console.log(
           "checking photos length in upload handler equal to 0 and length is ",
           uploadPhotos.length
         );
         var photoToUpload = [];
         uploadPhotos.forEach((item) => {
           photoToUpload.push({
             id: item.idMe,
             imageUrl: item.url,
           });
         });
         setPhoToUpload(photoToUpload);
       }
     }
   }, [uploadPhotos]);
   useEffect(() => {
     if (videoReached === video.length) {
       if (video.length > 0) {
         UploadImage(video[0].file, video[0].id, "video");
         if (uploadVideo.error === true) {
           setUploadVideoError(true);
           setClickUpload(false);
         }
       }
     }
   }, [videoReached]);

   useEffect(() => {
     if (
       uploadPhotoError === false &&
       uploadVideoError === false &&
       photoToUpload.length === photos.length &&
       clickUpload
     ) {
       console.log("came into if all are ok to upload");
       const uploadData = {
         designName: designName,
         designDescription: designDescription,
         designPrice: designPrice,
         designCategory: designCategory,
         photos: photoToUpload,
         video:
           video.length > 0
             ? { id: uploadVideo.idMe, imageUrl: uploadVideo.url }
             : null,
       };
       uploadToFirestore(uploadData);
     }
   }, [uploadPhotoError, uploadVideoError, photoToUpload, clickUpload]);
   useEffect(
     (e) => {
       if (uploaded) {
         navigate("/admin/recent");
       }
     },
     [uploaded]
   );
   useEffect(() => {
     if (photos.length >= 2) {
       setFormErrors({ ...formErrors, photoLength: false });
     } else if (photos.length > 0) {
       setFormErrors({ ...formErrors, photoLength: true });
     }
   }, [photos]);
   const uploadToFirestore = async (data) => {
     console.log("enter into firestore");
     console.log("dtaa is ", data);
     try {
       const docRef = await addDoc(collection(db, "designs"), data);
       setUploadingError(false);
       setUploaded(true);

       console.log("Document written with ID: ", docRef.id);
     } catch (e) {
       setUploadingError(true);
       setUploaded(false);
       console.error("Error adding document: ", e);
     }
   };

   const UploadImage = async (file, _id, post) => {
     console.log("file is ", file, " type is ", post);
     const fileName =
       post === "photo" ? `images/${file.name}` : `videos/${file.name}`;

     const stRef = storageRef(storage, fileName);

     const uploadTask = uploadBytesResumable(stRef, file);
     uploadTask.on(
       "state_changed",
       (snapshot) => {},
       (error) => {
         console.log(error);
         if (post === "photo") {
           setUpoadPhotos([
             ...uploadPhotos,
             {
               idMe: _id,
               error: true,
               url: "",
               error: error,
               filename: file.name,
             },
           ]);
           setPhotosReached((p) => p + 1);
         } else if (post === "video") {
           setUploadVideo({
             idMe: _id,
             error: true,
             url: "",
             error: error,
             filename: file.name,
           });
           setVideoReached((p) => p + 1);
         }
       },
       () => {
         getDownloadURL(uploadTask.snapshot.ref).then((url) => {
           console.log("url is ", url);
           if (post === "photo") {
             setUpoadPhotos([
               ...uploadPhotos,
               {
                 idMe: _id,
                 error: false,
                 url: url,
                 error: "",
                 filename: file.name,
               },
             ]);
             setPhotosReached((p) => p + 1);
           } else if (post === "video") {
             setUploadVideo({
               idMe: _id,
               error: false,
               url: url,
               error: "",
               filename: file.name,
             });
             setVideoReached((p) => p + 1);
           }
         });
       }
     );
   };

   const errorChecker = () => {
     let errors = {
       nameLength: false,
       descriptionLength: false,
       priceLength: false,
       priceFormat: false,
       photoLength: false,
     };
     if (designName.length < 6) {
       errors.nameLength = true;
     }
     if (designDescription.length < 20) {
       errors.descriptionLength = true;
     }
     if (designPrice.length < 1) {
       errors.priceLength = true;
     }
     if (designPrice.length > 0) {
       if (isNaN(designPrice)) {
         errors.priceFormat = true;
       }
     }
     if (photos.length < 2) {
       errors.photoLength = true;
     }

     setFormErrors(errors);

     if (
       !errors.nameLength ||
       !errors.descriptionLength ||
       !errors.priceLength ||
       !errors.priceFormat ||
       !errors.photoLength
     ) {
       return true;
     }
   };
   const uploadHandler = () => {
     setClickUpload(true);
     console.log("clicked upload handler");
     if (errorChecker()) {
       console.log("error checker is true there are no errors ");
       photos.map((item, index) => {
         UploadImage(item.file, item.id, "photo");
       });
       // var b = uploadPhotos.filter((item) => item.error === true);

       // if (b.length > 0) {
       //   console.log("checking photos length in upload handler greater than 0");
       //   setUploadPhotoError(true);
       // } else if (b.length === 0) {
       //   console.log(
       //     "checking photos length in upload handler equal to 0 and length is ",
       //     uploadPhotos.length
       //   );
       //   var photoToUpload = [];
       //   uploadPhotos.forEach((item) => {
       //     photoToUpload.push({
       //       id: item.idMe,
       //       imageUrl: item.url,
       //     });
       //   });

       // if (uploadPhotoError === false && uploadVideoError === false) {
       //   console.log("came into if all are ok to upload");
       //   const uploadData = {
       //     designName: designName,
       //     designDescription: designDescription,
       //     designPrice: designPrice,
       //     designCategory: designCategory,
       //     photos: photoToUpload,
       //     video:
       //       video.length > 0
       //         ? { id: uploadVideo.idMe, imageUrl: uploadVideo.url }
       //         : null,
       //   };
       //   uploadToFirestore(uploadData);
       // }
       // }
     } else {
       console.log("there are errors ");
       setClickUpload(false);
     }
   };
   const updateHandler = () => {};

   return (
     <div className="form">
       <div className="formData">
         <h2 className="formData_childrenOne_header">Add Details</h2>
         <div className="formData_childrenOne">
           <TextField
             id="outlined-basic"
             label="Name Of Design"
             variant="outlined"
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
             variant="outlined"
             id="outlined-basic"
             label="Description"
             onChange={(e) => {
               setDesignDescription(e.target.value);
               if (designDescription.length > 20) {
                 setFormErrors({ ...formErrors, descriptionLength: false });
               }
             }}
             helperText={
               formErrors.descriptionLength
                 ? "Description should be greater than 20"
                 : ""
             }
             error={formErrors.descriptionLength}
           />
           <div></div>
           <TextField
             id="outlined-basic"
             label="Rough Price in INR"
             variant="outlined"
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
