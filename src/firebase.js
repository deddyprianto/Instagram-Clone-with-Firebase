import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
   apiKey: "AIzaSyDENCnQaXPe8YCbnwUm3vZ2WhgIjka_EjQ",
   authDomain: "instagram-clone-1d500.firebaseapp.com",
   databaseURL: "https://instagram-clone-1d500.firebaseio.com",
   projectId: "instagram-clone-1d500",
   storageBucket: "instagram-clone-1d500.appspot.com",
   messagingSenderId: "128976701987",
   appId: "1:128976701987:web:1ffdf6374c435e538fff96",
   measurementId: "G-STENWCT8FS"
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export {db,auth,storage}