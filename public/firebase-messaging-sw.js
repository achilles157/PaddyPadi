importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBkrL9uPp_d0QoFMT-r-lcHXtOrKjFKZyU",
    authDomain: "paddypadi.firebaseapp.com",
    projectId: "paddypadi",
    storageBucket: "paddypadi.appspot.com",
    messagingSenderId: "483761534784",
    appId: "1:483761534784:web:7f58680f2b82803668eca5"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/pwa-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
