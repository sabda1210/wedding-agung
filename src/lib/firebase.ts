import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXNjco3FBPeQxQY9MIR2z94gALS4J7ndE",
  authDomain: "invitation-mila-agung.firebaseapp.com",
  projectId: "invitation-mila-agung",
  storageBucket: "invitation-mila-agung.firebasestorage.app",
  messagingSenderId: "330682042358",
  appId: "1:330682042358:web:d7f4cc83a9c71d62c029d7"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db, app};