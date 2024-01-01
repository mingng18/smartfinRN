import { db } from "./firebaseConfig";
import { setError } from "../store/redux/application_state/errorStateSlice";
import {
  removePendingState,
  setInPendingState,
} from "../store/redux/application_state/pendingStateSlice";
import { useDispatch } from "react-redux";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";

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

export async function addDocumentWithId(
  collectionName,
  documentId,
  documentData
) {
  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, documentData);
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

//Appointment
export async function fetchAppointmentsForPatient(patientId) {
  try {
    const collectionRef = collection(db, "appointment");
    const querySnapshot = await getDocs(collectionRef);

    const appointments = [];
    const promises = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.patient_id === patientId) {
        const promise = fetchDocument("healthcare", data.healthcare_id)
          .then((healthcareDoc) => {
            appointments.push({
              id: doc.id,
              healthcare_profile_picture: healthcareDoc.profile_picture,
              healthcare_first_name: healthcareDoc.first_name,
              ...data,
            });
          })
          .catch((error) => {
            console.error("Failed to fetch healthcare document:", error);
          });

        promises.push(promise);
      }
    });

    await Promise.all(promises); // Wait for all fetchDocument calls to complete

    // console.log("appointments", appointments);
    return appointments;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}


export async function fetchSideEffectsForPatient(patientId) {
  try {
    const collectionRef = collection(db, "side_effect");
    const querySnapshot = await getDocs(collectionRef);

    const sideEffects = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.patient_id === patientId) {
        sideEffects.push({ id: doc.id, ...data });
      }
    });

    return sideEffects;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}

export async function fetchVideosForPatient(patientId) {
  try {
    const collectionRef = collection(db, "video");
    const querySnapshot = await getDocs(collectionRef);

    const videos = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.submitter_id === patientId) {
        videos.push({ id: doc.id, ...data });
      }
    });

    return videos;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}
