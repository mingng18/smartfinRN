import firestore from "@react-native-firebase/firestore";
import { FIREBASE_COLLECTION } from "../constants/constants";

export async function fetchDocument(collectionName, documentId) {
  try {
    const documentRef = firestore().collection(collectionName).doc(documentId);
    const documentSnapshot = await documentRef.get();

    if (documentSnapshot.exists) {
      const documentData = documentSnapshot.data();
      return { id: documentSnapshot.id, ...documentData };
    } else {
      throw new Error(
        `Document '${documentId}' does not exist in collection '${collectionName}'`
      );
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}


export async function fetchCollection(collectionName) {
  try {
    const snapshot = await firestore().collection(collectionName).get();
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
  firestore()
    .collection(collectionName)
    .add(documentData)
    .then(() => {
      return docRef.id;
    })
    .catch((error) => {
      throw new Error("Failed to store document: " + error.message);
    });
}

export async function deleteDocument(collectionName, documentId) {
  firestore()
    .collection(collectionName)
    .doc(documentId)
    .delete()
    .then(() => {
      console.log("User deleted!");
    })
    .catch((error) => {
      throw new Error("Failed to store document: " + error.message);
    });
}

export async function addDocumentWithId(
  collectionName,
  documentId,
  documentData
) {
  firestore()
    .collection(collectionName)
    .doc(documentId)
    .set(documentData)
    .then(() => {
      console.log("User added!");
    })
    .catch((error) => {
      throw new Error("Failed to store document: " + error.message);
    });
}

export async function editDocument(collectionName, documentId, updatedData) {
  firestore()
    .collection(collectionName)
    .doc(documentId)
    .update(updatedData)
    .then(() => {
      console.log("User updated!");
    })
    .catch((error) => {
      console.error("Failed to edit document: " + error.message);
      throw error;
    });
}

export async function fetchAppointmentsForPatient(patientId) {
  try {
    const appointments = [];
    const promises = [];

    firestore()
      .collection(FIREBASE_COLLECTION.APPOINTMENT)
      .where("patient_id", "==", patientId)
      .get()
      .then((querySnapshot) => {
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
      });

    await Promise.all(promises); // Wait for all fetchDocument calls to complete

    console.log(
      "Appointments for Patients is in length: ",
      appointments.length
    );
    return appointments;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}

export async function fetchBookedDateOfAppointmentFromFirebase() {
  try {
    const bookedAppointmentDates = [];

    firestore()
      .collection(FIREBASE_COLLECTION.APPOINTMENT)
      .where("appointment_status", "in", ["pending", "accepted"])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          bookedAppointmentDates.push(
            data.scheduled_timestamp.toDate().toISOString()
          );
        });
      });

    // console.log("bookedAppointmentDates", bookedAppointmentDates);
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
    const sideEffects = [];

    firestore()
      .collection(FIREBASE_COLLECTION.SIDE_EFFECT)
      .where("patient_id", "==", patientId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          sideEffects.push({ id: doc.id, ...data });
        });
      });

    console.log("fetchSideEffectsForPatient firebase " + sideEffects);
    return sideEffects;
  } catch (error) {
    throw new Error(
      "Failed to fetch side effect for patient: " + error.message
    );
  }
}

export async function fetchVideosForPatient(patientId) {
  try {
    const videos = [];

    firestore()
      .collection(FIREBASE_COLLECTION.VIDEO)
      .where("submitter_id", "==", patientId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          videos.push({ id: doc.id, ...data });
        });
      });

    return videos;
  } catch (error) {
    throw new Error("Failed to fetch video for patients: " + error.message);
  }
}

export async function fetchVideosToBeReviewedForHealthcare() {
  try {
    const videos = [];
    const promises = [];

    firestore()
      .collection(FIREBASE_COLLECTION.VIDEO)
      .where("reviewer_id", "in", ["", null])
      .get()
      .then((querySnapshot) => {
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
              throw error;
            });

          promises.push(promise);
        });
      });

    await Promise.all(promises);

    console.log("fetchVideosToBeReviewedForHealthcare Videos", videos);

    return videos;
  } catch (error) {
    throw new Error("Failed to fetch videos: " + error.message);
  }
}

export async function fetchAppointmentsForHealthcare(healthcareId) {
  try {
    const appointments = [];
    const pendingAppointments = [];
    const promises = [];

    firestore()
      .collection(FIREBASE_COLLECTION.APPOINTMENT)
      .where("healthcare_id", "in", [healthcareId, "", null])
      .get()
      .then((queryAppointmentSnapshot) => {
        queryAppointmentSnapshot.forEach((doc) => {
          const data = doc.data();

          const promise = fetchDocument(
            FIREBASE_COLLECTION.PATIENT,
            data.patient_id
          )
            .then((patientDoc) => {
              if (
                data.healthcare_id === healthcareId &&
                data.appointment_status === "accepted"
              ) {
                appointments.push({
                  id: doc.id,
                  patient_data: patientDoc,
                  ...data,
                });
              } else if (data.appointment_status === "pending") {
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
      });

    await Promise.all(promises); // Wait for all fetchDocument calls to complete

    console.log("appointments firebase ", appointments);
    console.log("pendingAppointments firebase ", pendingAppointments);
    return [appointments, pendingAppointments];
  } catch (error) {
    throw new Error(
      "Failed to fetch appointments for healthcare: " + error.message
    );
  }
}

export async function fetchSideEffectsAlertHealthcare() {
  try {
    const sideEffects = [];
    const promises = [];

    firestore()
      .collection(FIREBASE_COLLECTION.SIDE_EFFECT)
      .where("healthcare_id", "in", ["", null])
      .get()
      .then((querySnapshot) => {
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
                patient_phone_number: patientDoc.phone_number
                  ? patientDoc.phone_number
                  : "",
                ...data,
              });
            })
            .catch((error) => {
              console.error("Failed to fetch patient document:", error);
            });

          promises.push(promise);
        });
      });

    await Promise.all(promises);

    return sideEffects;
  } catch (error) {
    throw new Error("Failed to fetch appointments: " + error.message);
  }
}
