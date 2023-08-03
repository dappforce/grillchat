// firebaseConfig.js
import { getFirebaseConfig } from '@/utils/env/client'
import * as firebase from 'firebase/app'
import 'firebase/firestore' // Import any Firebase services you plan to use

const firebaseApp = firebase.initializeApp(getFirebaseConfig())

export default firebaseApp
