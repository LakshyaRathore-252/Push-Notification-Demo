import express from "express";
import admin from "firebase-admin";
import serviceAccount from "./service-account.json" assert { type: "json" };
import webpush from "web-push";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


// 🔹 Firebase Admin SDK (for Android/Chrome FCM)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// 🔹 VAPID keys (generate once using `npx web-push generate-vapid-keys`)
const vapidKeys = {
    publicKey: "BO9QWgajdjfsiJ-5S_vOEwCDtnMiXUM2XDrK0UtVUf0TzJ2SEP5HR1zngrv5K5fmyHEN1n7nHW14eTwWPbnzTDc",
    privateKey: "ethsL_0LJs0nc2I5eGIhd-ra69B8MZgnlfL3sGHwEr0",
};

webpush.setVapidDetails(
    "mailto:you@example.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Storage
let savedTokens = new Set(); // for FCM tokens
let safariSubscriptions = []; // for iOS Safari subscriptions

// 🔹 Save FCM token API
app.post("/save-token", (req, res) => {
    const { token } = req.body;

    // Safari ki subscription kabhi token nahi hoti, so guard
    if (!token || token.startsWith("{")) {
        return res.status(400).send("❌ Invalid FCM token");
    }


    if (token) {
        savedTokens.add(token.trim());
        console.log("✅ Saved FCM token:", token);
        return res.status(200).send("Token saved successfully");
    }
    res.status(400).send("No token provided");
});

// 🔹 Save Safari subscription API
app.post("/save-subscription", (req, res) => {
    const { subscription } = req.body;
    if (subscription) {
        safariSubscriptions.push(subscription);
        console.log("✅ Saved Safari subscription");
        return res.status(200).send("Subscription saved");
    }
    res.status(400).send("No subscription provided");
});

// 🔹 Send push notification via FCM (Android/Chrome)
app.get("/send-fcm", async (req, res) => {
    if (savedTokens.size === 0)
        return res.status(400).send("❌ No FCM tokens available");

    console.log("savedTOken", savedTokens);

    const token = Array.from(savedTokens).pop();
    console.log("Sending FCM push to token:", token);

    const message = {
        data: {
            title: "FCM Push",
            body: "Hello Android Users 🎉"
        },
        token,
    };


    try {
        const response = await admin.messaging().send(message);
        console.log("✅ FCM Notification sent:", response);
        res.status(200).send("Notification sent: " + JSON.stringify(response));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error sending FCM push: " + err.message);
    }
});

// 🔹 Send push notification via Safari Web Push
app.get("/send-safari", async (req, res) => {
    if (safariSubscriptions.length === 0)
        return res.status(400).send("❌ No Safari subscriptions");

    const payload = JSON.stringify({
        title: "Safari Push 🎉",
        body: "Hello from iOS Web Push",
    });

    try {
        await Promise.all(
            safariSubscriptions.map((sub) => webpush.sendNotification(sub, payload))
        );
        console.log("✅ Safari Notification sent");
        res.send("Safari push sent!");
    } catch (err) {
        console.error("❌ Safari push failed:", err);
        res.status(500).send("Error sending Safari push: " + err.message);
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
