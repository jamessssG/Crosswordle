// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwqFrntmJU12a6wxayeTb-iP0A_ZlDb0Y",
  authDomain: "crosswordle-mg.firebaseapp.com",
  projectId: "crosswordle-mg",
  storageBucket: "crosswordle-mg.firebasestorage.app",
  messagingSenderId: "511788984229",
  appId: "1:511788984229:web:d126cf8f705dc975d02a4c",
  measurementId: "G-7S3RXB44Q1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = 'en';

// Google Sign-in setup
const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById("google-signin-btn");
googleLogin.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Signed in as ${user.displayName}`);
    })
    .catch((error) => {
      alert(`Sign-in failed: ${error.message}`);
    });
});
