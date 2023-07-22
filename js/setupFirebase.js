// setupFirebase.js

// Load the Firebase SDK URLs directly
import { initializeApp } from "https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/8.6.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/8.6.1/firebase-database.js";

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
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getDatabase(app);

  // Export the Firebase app and database for use in other modules
  return { app, db };
}

// Call the setupFirebase function to initialize Firebase and export app and db
setupFirebase();