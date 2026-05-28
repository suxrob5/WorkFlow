// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/cordova";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJippIMXTncZSfxqwTtzTkSPBHXoR8mhg",
  authDomain: "workflow-2f3d5.firebaseapp.com",
  projectId: "workflow-2f3d5",
  storageBucket: "workflow-2f3d5.firebasestorage.app",
  messagingSenderId: "578814345330",
  appId: "1:578814345330:web:aefe7078e33ca87787c2eb",
  measurementId: "G-J613096JQJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);