import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { BUCKET_NAME, PROJECT_ID } from "~/lib/constants";

const firebaseConfig = {
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_NAME,
  messagingSenderId: "654454852296",
  apiKey: "AIzaSyCcEd-4OO9wY1jlpA2WRpzRfkdZAsFoXX8",
  appId: "1:654454852296:web:bf86a0ddbc74f6a35e73fd",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
