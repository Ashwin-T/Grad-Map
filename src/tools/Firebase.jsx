// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken  } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDWUT6dgKr0G9zdFZyEB24PfhX9nFpOZDA",
  authDomain: "grad-map.firebaseapp.com",
  projectId: "grad-map",
  storageBucket: "grad-map.appspot.com",
  messagingSenderId: "569872317988",
  appId: "1:569872317988:web:7b04413fb80f7ea7dd22b1",
  measurementId: "G-2WK0BHW6FD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

// const askForPermissionToReceiveNotifications = async () => {
//   try {
//     await messaging.requestPermission();
//     const token = await messaging.getToken();
//     console.log('Your token is:', token);
    
//     return token;
//   } catch (error) {
//     console.error(error);
//   }
// }

getToken(messaging, { vapidKey: 'BM-93AFzcHhpaZW2CWuFTRyP4zysYG4MvGltz0JKPXCY9WEyDtcBHd6g_ihhXc33xDYuIrqfhD-4ADM2SaORYlo' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});

export { app, analytics};