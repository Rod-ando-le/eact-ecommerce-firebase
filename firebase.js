// firebase.js
// Initializes Firebase for the whole app.
//
// 👉 REPLACE the values below with YOUR config from the Firebase console:
//    Project settings → General → Your apps → SDK setup and configuration → Config
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)

// Exported singletons used across the app
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
