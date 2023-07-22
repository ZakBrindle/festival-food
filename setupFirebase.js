import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDweH-W6wCsTOvOsWIZf-Yl6mK_T1okQ4E",
  authDomain: "festival-food-db.firebaseapp.com",
  projectId: "festival-food-db",
  storageBucket: "festival-food-db.appspot.com",
  messagingSenderId: "174006042170",
  appId: "1:174006042170:web:3fc5a7f3b4600175ab7f03",
  measurementId: "G-Y1KG8W3CKP"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
