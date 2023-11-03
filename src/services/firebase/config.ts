// firebaseConfig.js
import { getFirebaseConfig } from '@/utils/env/client'
import * as firebase from 'firebase/app'
import 'firebase/firestore' // Import any Firebase services you plan to use

let firebaseApp: firebase.FirebaseApp | null = null
const config = getFirebaseConfig()
if (config) {
  firebaseApp = firebase.initializeApp(config)
}

export default firebaseApp
