import { FIREBASE_COLLECTION } from "../constants/constants";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  or,
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

export async function deleteDocument(collectionName, documentId) {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
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
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error("Failed to edit document: " + error.message);
    throw error;
  }
}

//Appointment
export async function fetchAppointmentsForPatient(patientId) {
  try {
    const appointmentCollectionRef = collection(
      db,
      FIREBASE_COLLECTION.APPOINTMENT
    );

    const appointments = [];
    const promises = [];

    const queryAppointment = query(
      appointmentCollectionRef,
      where("patient_id", "==", patientId)
    );

    const querySnapshot = await getDocs(queryAppointment);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.healthcare_id) {
        const querySnapshotHealthcarePromise = fetchDocument(
          FIREBASE_COLLECTION.HEALTHCARE,
          data.healthcare_id
        )
          .then((healthcareDoc) => {
            appointments.push({
              id: doc.id,
              healthcare_profile_picture: healthcareDoc.profile_pic_url
                ? healthcareDoc.profile_pic_url
                : "",
              healthcare_first_name: healthcareDoc.first_name
                ? healthcareDoc.first_name
                : "",
              ...data,
            });
          })
          .catch((error) => {
            console.error(
              "Failed to fetch healthcare document after fetching appointment:",
              error
            );
          });
        promises.push(querySnapshotHealthcarePromise);
      } else {
        // If healthcare_id doesn't exist, push an appointment with empty profile_picture and first_name
        appointments.push({
          id: doc.id,
          healthcare_profile_picture: "", // Empty profile picture
          healthcare_first_name: "", // Empty first name
          ...data,
        });
      }
    });

    await Promise.all(promises); // Wait for all fetchDocument calls to complete

    console.log("firebase appointments mauhaha", appointments.length);
    return appointments;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}

export async function fetchBookedDateOfAppointmentFromFirebase() {
  try {
    const appointmentCollectionRef = collection(
      db,
      FIREBASE_COLLECTION.APPOINTMENT
    );
    const queryAppointment = query(
      appointmentCollectionRef,
      or(
        where("appointment_status", "==", "pending"),
        where("appointment_status", "==", "accepted")
      )
    );

    const querySnapshot = await getDocs(queryAppointment);

    const bookedAppointmentDates = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Firestore Timestamp:", data.scheduled_timestamp);
      console.log("Converted to ISOString:", data.scheduled_timestamp.toDate().toISOString());
      console.log("data.scheduled_timestamp.toDate().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })", data.scheduled_timestamp.toDate().toLocaleTimeString('en-US'));
      bookedAppointmentDates.push(data.scheduled_timestamp.toDate().toISOString());
    });
    console.log("bookedAppointmentDates", bookedAppointmentDates)
    return bookedAppointmentDates;
  } catch (error) {
    console.log("error in fetchBookedDateOfAppointment", error);
    throw new Error(
      "Failed to fetch booked appointment dates: " + error.message
    );
  }
}

export async function fetchSideEffectsForPatient(patientId) {
  try {
    const collectionRef = collection(db, FIREBASE_COLLECTION.SIDE_EFFECT);
    const querySideEffectForPatient = query(
      collectionRef,
      where("patient_id", "==", patientId)
    );
    const querySnapshot = await getDocs(querySideEffectForPatient);

    const sideEffects = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sideEffects.push({ id: doc.id, ...data });
    });

    console.log("sideEffects firebase " + sideEffects);
    return sideEffects;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}

export async function fetchVideosForPatient(patientId) {
  try {
    const collectionRef = collection(db, FIREBASE_COLLECTION.VIDEO);
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
    const collectionRef = collection(db, FIREBASE_COLLECTION.VIDEO);
    const queryVideosToBeReviewed = query(
      collectionRef,
      or(where("reviewer_id", "==", ""), where("reviewer_id", "==", null))
    );

    const querySnapshot = await getDocs(queryVideosToBeReviewed);

    const videos = [];
    const promises = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // console.log("reviewer: " + data.reviewer_id);
      // console.log("pushing video");
      const promise = fetchDocument(
        FIREBASE_COLLECTION.PATIENT,
        data.submitter_id
      )
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
    });

    // querySnapshot.forEach((doc) => {
    //   const data = doc.data();
    //   console.log("reviewer: " + data.reviewer_id);
    //   if (data.reviewer_id === "" || data.reviewer_id === null) {
    //     console.log("pushing video");
    //     const promise = fetchDocument(
    //       FIREBASE_COLLECTION.PATIENT,
    //       data.submitter_id
    //     )
    //       .then((patientDoc) => {
    //         videos.push({
    //           id: doc.id,
    //           patient_profile_picture: patientDoc.profile_pic_url
    //             ? patientDoc.profile_pic_url
    //             : "",
    //           patient_first_name: patientDoc.first_name
    //             ? patientDoc.first_name
    //             : "",
    //           ...data,
    //         });
    //       })
    //       .catch((error) => {
    //         console.error("Failed to fetch patient document:", error);
    //         console.log("this id got error" + data.submitter_id);
    //       });

    //     promises.push(promise);
    //   }
    // });
    await Promise.all(promises);

    console.log("review Videos", videos);

    return videos;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}

export async function fetchAppointmentsForHealthcare(healthcareId) {
  try {
    const appointmentCollectionRef = collection(
      db,
      FIREBASE_COLLECTION.APPOINTMENT
    );
    const patientCollectionRef = collection(db, FIREBASE_COLLECTION.PATIENT);

    const queryAppointment = query(
      appointmentCollectionRef,
      or(
        or(
          where("healthcare_id", "==", healthcareId),
          where("healthcare_id", "==", "")
        ),
        where("healthcare_id", "==", null)
      )
    );

    const queryAppointmentSnapshot = await getDocs(queryAppointment);

    const appointments = [];
    const pendingAppointments = [];
    const promises = [];

    queryAppointmentSnapshot.forEach((doc) => {
      const data = doc.data();

      const promise = fetchDocument(
        FIREBASE_COLLECTION.PATIENT,
        data.patient_id
      )
        .then((patientDoc) => {
          if (data.healthcare_id === healthcareId) {
            appointments.push({
              id: doc.id,
              patient_data: patientDoc,
              ...data,
            });
          } else {
            pendingAppointments.push({
              id: doc.id,
              patient_data: patientDoc,
              ...data,
            });
          }
        })
        .catch((error) => {
          console.error("Failed to fetch healthcare document:", error);
        });

      promises.push(promise);
    });

    await Promise.all(promises); // Wait for all fetchDocument calls to complete

    // console.log("appointments firebase ", appointments);
    // console.log("pendingAppointments firebase ", pendingAppointments);
    return [appointments, pendingAppointments];
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}

export async function fetchSideEffectsAlertHealthcare() {
  try {
    const collectionRef = collection(db, FIREBASE_COLLECTION.SIDE_EFFECT);
    const querySideEffectForHealthcare = query(
      collectionRef,
      or(where("healthcare_id", "==", ""), where("healthcare_id", "==", null))
    );
    const querySnapshot = await getDocs(querySideEffectForHealthcare);

    const sideEffects = [];
    const promises = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const promise = fetchDocument(
        FIREBASE_COLLECTION.PATIENT,
        data.patient_id
      )
        .then((patientDoc) => {
          sideEffects.push({
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
        });

      promises.push(promise);
      // sideEffects.push({ id: doc.id, ...data });
    });
    await Promise.all(promises);

    return sideEffects;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}
