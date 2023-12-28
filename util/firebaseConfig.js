// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsTk8C4uhIeaqXsO8w5rn18gp-b-Tatzc",
  authDomain: "mytbcompanion.firebaseapp.com",
  projectId: "mytbcompanion",
  storageBucket: "mytbcompanion.appspot.com",
  messagingSenderId: "73133667345",
  appId: "1:73133667345:web:26d7d1e0158b7ad894edb0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app);


// export async function getPatient() {
//   const citiesCol = collection(db, 'patient');
//   const citySnapshot = await getDocs(citiesCol);
//   citySnapshot.forEach((doc)=>{
//     console.log(doc.id);
//   });
  // const cityList = citySnapshot.docs.map(doc => doc.data());
  // return cityList;
// }