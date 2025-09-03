// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCEH3KMPsJcwimdQtYpkj-e872dAG0jF0c",
    authDomain: "push-notification-318f2.firebaseapp.com",
    projectId: "push-notification-318f2",
    storageBucket: "push-notification-318f2.firebasestorage.app",
    messagingSenderId: "186665496024",
    appId: "1:186665496024:web:9292b5707c71c15e71d6ad",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
