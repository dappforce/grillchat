import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

const app = initializeApp({
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID, // Firebase Message Sender Config.
})

const initMessaging = getMessaging(app)
