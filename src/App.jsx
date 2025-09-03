import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";

const VAPID_PUBLIC_KEY =
  "BO9QWgajdjfsiJ-5S_vOEwCDtnMiXUM2XDrK0UtVUf0TzJ2SEP5HR1zngrv5K5fmyHEN1n7nHW14eTwWPbnzTDc"; // from web-push generate

const App = () => {
  const [token, setToken] = useState("");

  const isSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
    "safari" in window &&
    "PushManager" in window;


  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("❌ Permission not granted");
      return;
    }

    if (isSafari) {
      // --- Safari iOS 16.4+ flow
      const registration = await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      console.log("📡 Safari Subscription:", subscription);

      await axios.post("/api/save-subscription", { subscription });
      alert("✅ Safari subscription sent to backend");
    } else {
      // --- Chrome/Android/Firefox flow
      const fcmToken = await getToken(messaging, {
        vapidKey:
          "BI3YaeYJ1LdFFCKttRDS2sM-5Ba3-qIEhr-bB3OWiyd6FwNt-lUMeArcMrp7DZnMpOZA7_RXViyrhqoryP1i72M",
      });

      if (fcmToken) {
        setToken(fcmToken);
        await axios.post("/api/save-token", {
          token: fcmToken,
        });
        alert("✅ FCM token sent to backend");
      } else {
        console.log("❌ No FCM token");
      }
    }
  };

  useEffect(() => {
    if (!isSafari) {
      onMessage(messaging, (payload) => {
        console.log("📩 Foreground FCM:", payload);

        // ✅ ab tum control se notification show kar rahe ho
        new Notification(payload.data.title, {
          body: payload.data.body,
          icon: "/logo.png",
        });
      });
    }
  }, []);







  return (
    <div>
      <Button onClick={requestPermission} variant="contained">
        Enable Push Notifications
      </Button>
    </div>
  );
};

// Helper
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default App;
