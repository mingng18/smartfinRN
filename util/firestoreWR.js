import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
  getDoc,
  updateDoc
} from "firebase/firestore";

export async function fetchDocument(collectionName, documentId) {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const documentData = docSnapshot.data();
      return { id: docSnapshot.id, ...documentData };
    } else {
      throw new Error(
        `Document '${documentId}' does not exist in collection '${collectionName}'`
      );
    }
  } catch (error) {
    console.log("Error fetching document:", error);
    throw new Error("Failed to fetch document");
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
    console.log("Edit Successful!");
  } catch (error) {
    console.error("Failed to edit document: " + error.message);
    throw error;
  }
}

export async function updateDocument(collectionName, documentId, updatedData) {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, updatedData);
    console.log("Update Successful!");
  } catch (error) {
    console.error("Failed to update document: " + error.message);
    throw error;
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
        if (data.healthcare_id) {
          const promise = fetchDocument("healthcare", data.healthcare_id)
            .then((healthcareDoc) => {
              appointments.push({
                id: doc.id,
                healthcare_profile_picture: healthcareDoc.profile_picture
                  ? healthcareDoc.profile_picture
                  : "",
                healthcare_first_name: healthcareDoc.first_name
                  ? healthcareDoc.first_name
                  : "",
                ...data,
              });
            })
            .catch((error) => {
              console.error("Failed to fetch healthcare document:", error);
            });

          promises.push(promise);
        } else {
          // If healthcare_id doesn't exist, push an appointment with empty profile_picture and first_name
          appointments.push({
            id: doc.id,
            healthcare_profile_picture: "", // Empty profile picture
            healthcare_first_name: "", // Empty first name
            ...data,
          });
        }
      }
    });

    await Promise.all(promises); // Wait for all fetchDocument calls to complete

    console.log("appointments", appointments);
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

export async function fetchVideosToBeReviewedForHealthcare() {
  try {
    const collectionRef = collection(db, "video");
    const querySnapshot = await getDocs(collectionRef);

    const videos = [];
    const promises = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("reviewer: " + data.reviewer_id);
      if (data.reviewer_id === "" || data.reviewer_id === null) {
        console.log("pushing video");
        const promise = fetchDocument("patient", data.submitter_id)
          .then((patientDoc) => {
            videos.push({
              id: doc.id,
              patient_profile_picture: patientDoc.profile_pic_url
                ? patientDoc.profile_pic_url
                : "",
              patient_first_name: patientDoc.first_name
                ? patientDoc.first_name
                : "",
              ...data,
            });
          })
          .catch((error) => {
            console.error("Failed to fetch patient document:", error);
            console.log("this id got error" + data.submitter_id);
          });

        promises.push(promise);
      }
    });
    await Promise.all(promises);

    console.log("review Videos", videos);

    return videos;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}

export async function fetchAppointmentsForHealthcare(healthcareId) {
  try {
    const collectionRef = collection(db, "appointment");
    const querySnapshot = await getDocs(collectionRef);

    const appointments = [];
    const promises = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.healthcare_id === healthcareId) {
        if (data.healthcare_id) {
          const promise = fetchDocument("healthcare", data.healthcare_id)
            .then((healthcareDoc) => {
              appointments.push({
                id: doc.id,
                healthcare_profile_picture: healthcareDoc.profile_picture
                  ? healthcareDoc.profile_picture
                  : "",
                healthcare_first_name: healthcareDoc.first_name
                  ? healthcareDoc.first_name
                  : "",
                ...data,
              });
            })
            .catch((error) => {
              console.error("Failed to fetch healthcare document:", error);
            });

          promises.push(promise);
        } else {
          // If healthcare_id doesn't exist, push an appointment with empty profile_picture and first_name
          appointments.push({
            id: doc.id,
            healthcare_profile_picture: "", // Empty profile picture
            healthcare_first_name: "", // Empty first name
            ...data,
          });
        }
      }
    });

    await Promise.all(promises); // Wait for all fetchDocument calls to complete

    console.log("appointments", appointments);
    return appointments;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}
