import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Dynamically construct Firebase Config prioritizing environment variables (for Vercel, Netlify, etc.)
// and falling back to the local firebase-applet-config.json (for local/AI Studio previews).
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId || ""
};

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId || "(default)";

// Initialize Firebase App
const app = initializeApp(config);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore with the custom database ID
const db = getFirestore(app, databaseId);

/**
 * Register a new Officer profile in live Firebase Auth
 */
export async function registerCloudUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Cloud Register Error:", error);
    return { user: null, error: translateAuthError(error) };
  }
}

/**
 * Log in to an existing Officer profile in live Firebase Auth
 */
export async function loginCloudUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Cloud Login Error:", error);
    return { user: null, error: translateAuthError(error) };
  }
}

/**
 * Sign in using Google Account (supported automatically out of the box)
 */
export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Google Login Error:", error);
    return { user: null, error: translateAuthError(error) };
  }
}

/**
 * Sign out of the cloud archives
 */
export async function logoutCloudUser() {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    console.error("Cloud Signout Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Monitor live Auth state changes
 */
export function onCloudAuthStateChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Save user study progression records to Cloud Firestore database
 */
export async function saveUserStateToCloud(userId, stateData) {
  if (!userId) return false;
  
  try {
    // Sanitize stateData by parsing/stringifying to avoid Firestore errors with non-plain objects or undefined properties
    const sanitizedState = JSON.parse(JSON.stringify(stateData));
    
    // Reference to doc in users collection
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      ...sanitizedState,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Firestore Save Error:", error);
    return false;
  }
}

/**
 * Fetch user study progression records from Cloud Firestore database
 */
export async function loadUserStateFromCloud(userId) {
  if (!userId) return null;
  
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Firestore Load Error:", error);
    return null;
  }
}

/**
 * Map Firebase Auth error codes to user-friendly medieval/fictional descriptions
 */
function translateAuthError(error) {
  const code = error?.code || "";
  const message = error?.message || "";
  
  switch (code) {
    case "auth/email-already-in-use":
      return "That email address is already registered to another Officer Profile.";
    case "auth/invalid-email":
      return "The mystical email format you entered is invalid. Re-check the address scrolls.";
    case "auth/weak-password":
      return "The password spell is too weak! Try at least 6 secure characters.";
    case "auth/user-disabled":
      return "This profile has been locked by high command.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email passphrase or credential wizardry. Access denied. Make sure you have created an account first, or re-check the entered credentials.";
    default:
      return `Authentication failed. Code: [${code}]. Message: ${message}. If this persists, verify your network link or retry.`;
  }
}
