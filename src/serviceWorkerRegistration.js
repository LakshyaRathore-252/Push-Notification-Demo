export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swFile = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        ? '/safari-sw.js'
        : '/firebase-messaging-sw.js';

      navigator.serviceWorker
        .register(swFile)
        .then((registration) => {
          console.log('✅ ServiceWorker registered:', swFile, registration.scope);
        })
        .catch((err) => {
          console.log('❌ ServiceWorker registration failed:', err);
        });
    });
  }
}
