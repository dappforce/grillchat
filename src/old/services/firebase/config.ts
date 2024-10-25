// firebaseConfig.js
import { env } from '@/env.mjs'
import * as firebase from 'firebase/app'
import 'firebase/firestore' // Import any Firebase services you plan to use

export function getFirebaseConfig() {
  const apiKey = env.NEXT_PUBLIC_FIREBASE_API_KEY
  const authDomain = env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const storageBucket = env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  const messagingSenderId = env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID
  const appId = env.NEXT_PUBLIC_FIREBASE_APP_ID

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    return null
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  }
}

let firebaseApp: firebase.FirebaseApp | null = null
const config = getFirebaseConfig()
if (config) {
  firebaseApp = firebase.initializeApp(config)
}

export default firebaseApp
