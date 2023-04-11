import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsudD9YpAMxtA4EUcZdRs8NWM6bMmbz4Q",
  authDomain: "odin-library-a64e9.firebaseapp.com",
  projectId: "odin-library-a64e9",
  storageBucket: "odin-library-a64e9.appspot.com",
  messagingSenderId: "924809027618",
  appId: "1:924809027618:web:fc968e54c50c3e283c2a7b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default { app };
