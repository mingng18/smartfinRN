import { db } from "./firebaseConfig";
import { setError } from "../store/redux/application_state/errorStateSlice";
import {
  removePendingState,
  setInPendingState,
} from "../store/redux/application_state/pendingStateSlice";
import { useDispatch } from "react-redux";
import { getFirestore, collection, getDocs, setDoc, doc, addDoc } from "firebase/firestore";

export async function fetchDocument(collectionName, documentId) {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
        const documentData = docSnapshot.data();
        return { id: docSnapshot.id, ...documentData };
    } else {
        throw new Error("Document does not exist");
    }
}

export async function fetchCollection(collectionName) {
    try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        const documents = [];

        snapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });

        return documents;
    } catch (error) {
        throw new Error("Failed to fetch collection: " + error.message);
    }
}

export async function addDocument(collectionName, documentData) {
    try {
        const collectionRef = collection(db, collectionName);
        const docRef = await addDoc(collectionRef, documentData);
        return docRef.id;
    } catch (error) {
        throw new Error("Failed to store document: " + error.message);
    }
}

//to further edit unusable at the moment
export async function editDocument(collectionName, documentId, updatedData) {
    try {
        const docRef = doc(db, collectionName, documentId);
        await setDoc(docRef, updatedData);
    } catch (error) {
        throw new Error("Failed to edit document: " + error.message);
    }
}





