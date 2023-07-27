// firebaseConfig.js
import {
  getFirebaseApiKey,
  getFirebaseAppId,
  getFirebaseAuthDomain,
  getFirebaseMeasurementId,
  getFirebaseMessagingId,
  getFirebaseProjectId,
  getFirebaseStorageBucket,
} from '@/utils/env/client'
import * as firebase from 'firebase/app'
import 'firebase/firestore' // Import any Firebase services you plan to use

const firebaseConfig = {
  apiKey: getFirebaseApiKey(),
  authDomain: getFirebaseAuthDomain(),
  projectId: getFirebaseProjectId(),
  storageBucket: getFirebaseStorageBucket(),
  messagingSenderId: getFirebaseMessagingId(),
  appId: getFirebaseAppId(),
  measurementId: getFirebaseMeasurementId(),
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp
