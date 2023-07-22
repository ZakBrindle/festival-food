// setupFirebase.js

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDweH-W6wCsTOvOsWIZf-Yl6mK_T1okQ4E",
  authDomain: "festival-food-db.firebaseapp.com",
  projectId: "festival-food-db",
  storageBucket: "festival-food-db.appspot.com",
  messagingSenderId: "174006042170",
  appId: "1:174006042170:web:3fc5a7f3b4600175ab7f03",
  measurementId: "G-Y1KG8W3CKP"
};

// Function to set up Firebase
function setupFirebase() {
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // Return the Firebase app and database for use in app.js
  return { app, db };
}

// Call the setupFirebase function and store the returned app and db objects in window
window.firebaseApp = setupFirebase();
