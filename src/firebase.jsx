
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXJXoAne6kcjJOK23WL5TOftXr_8RqoL4",
  authDomain: "restaurent-management-1564c.firebaseapp.com",
  projectId: "restaurent-management-1564c",
  storageBucket: "restaurent-management-1564c.firebasestorage.app",
  messagingSenderId: "548011552691",
  appId: "1:548011552691:web:65aeb211f5d63f647fa5c6",
  measurementId: "G-12GSBZWC38"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
// const analytics = getAnalytics(app);


export {db, auth};