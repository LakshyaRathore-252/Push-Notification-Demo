// ✅ Safari/iOS Push handler
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log("📩 Safari push:", data);

    event.waitUntil(
      self.registration.showNotification(data.title || "Safari Push", {
        body: data.body || "No body",
        icon: "/logo.png",
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
