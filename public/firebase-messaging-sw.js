// Import Firebase for FCM
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCEH3KMPsJcwimdQtYpkj-e872dAG0jF0c",
  authDomain: "push-notification-318f2.firebaseapp.com",
  projectId: "push-notification-318f2",
  storageBucket: "push-notification-318f2.firebasestorage.app",
  messagingSenderId: "186665496024",
  appId: "1:186665496024:web:9292b5707c71c15e71d6ad",
});

const messaging = firebase.messaging();

// ✅ Background handler (only for FCM)
messaging.onBackgroundMessage((payload) => {
  console.log("📩 FCM background:", payload);

  self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
    icon: "/logo192.png",
  });
});
