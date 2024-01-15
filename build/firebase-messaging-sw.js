importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
const firebaseConfig = {
    apiKey: "AIzaSyCLXs3ISybpyPaMxzBNuoAY7zdpJDaHqKk",
    authDomain: "test-push-9228c.firebaseapp.com",
    databaseURL: "test-push-9228c",
    projectId: "test-push-9228c",
    storageBucket: "test-push-9228c.appspot.com",
    messagingSenderId: "520664760711",
    appId: "1:520664760711:web:16dad0fca74255ac6dd322",
    measurementId: "G-XV2QWBWDJ7"
};

firebase.initializeApp(firebaseConfig);


// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function(payload) {
  let obj = JSON.parse(localStorage.getItem("authUser"));
  if(obj.notifications.length){
    obj.notifications.push({
      id: (obj.notifications.length+1),
      titulo: payload.notification.title,
      descripcion: payload.notification.body,
      created_at: new Date().toISOString()
    });
  }

  localStorage.setItem("authUser",JSON.stringify(obj));

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body || "Background Message body.",
    icon: payload.notification.icon || "/itwonders-web-logo.png"
  };

  /*self.registration.showNotification(notificationTitle,
    notificationOptions);*/
});
