import { db } from "../lib/firebase";

import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";




const usersCollection = collection(db, "messages");

export const addMessage = async (userData: messages) => {
  const docRef = await addDoc(usersCollection, userData);
  return docRef.id;
};

export const getMessages = async () => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};