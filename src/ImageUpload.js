import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import firebase from 'firebase';
import { db, storage } from './firebase';
import './imageUpload.css'

function ImageUpload({ username }) {
   const [caption, setCaption] = useState("");
   const [image, setImage] = useState("");
   const [proggress, setProggress] = useState(0)
   const handleFile = (e) => {
      if (e.target.files[0]) {
         setImage(e.target.files[0])
      }
   }
   const handleButtonFile = () => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on("state_changed", (snapshot) => {
         const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
         setProggress(progress);
      }, (error) => { alert(error.message) },
         () => {
            storage.ref("images").child(image.name).getDownloadURL().then((url) => {
               db.collection("post").add({
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  post: caption,
                  image: url,
                  username: username
               });
               setProggress(0);
               setCaption("");
               setImage(null);
            })
         })
   }
   return (
      <div className="image-upload">
         <div className="content">
            <progress value={proggress} className="imageupload_proggress" max="100" />
            <input type="text" value={caption} placeholder="Enter Some Text" onChange={(e) => setCaption(e.target.value)} />
            <input type="file" onChange={handleFile} />
            <Button onClick={handleButtonFile}>
               Upload
            </Button>
         </div>
      </div>
   )
}

export default ImageUpload
