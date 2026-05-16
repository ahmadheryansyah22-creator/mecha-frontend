import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBPkxA0G9cJEc6bmyD8SpBf9fQJraxGds4",
  authDomain: "mecha-e5c4b.firebaseapp.com",
  projectId: "mecha-e5c4b",
  storageBucket: "mecha-e5c4b.firebasestorage.app",
  messagingSenderId: "313127021715",
  appId: "1:313127021715:web:13fdd457af5eb83b50f166"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
auth.settings.appVerificationDisabledForTesting = false

const googleProvider = new GoogleAuthProvider()
const phoneProvider = new PhoneAuthProvider(auth)

export { auth, googleProvider, phoneProvider }