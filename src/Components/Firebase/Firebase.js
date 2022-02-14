import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTQ9QKL8SKoJNddLbIP77MEkVQ0Xxtcgs",
  authDomain: "botiqueadmin.firebaseapp.com",
  databaseURL: "https://botiqueadmin-default-rtdb.firebaseio.com",
  projectId: "botiqueadmin",
  storageBucket: "botiqueadmin.appspot.com",
  messagingSenderId: "170593094032",
  appId: "1:170593094032:web:428de961df148ec66d4b15",
  //...
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
