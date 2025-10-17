// @ts-nocheck
let auth, db, isFirebaseConnected;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

try {
  // Check if firebase is loaded and if the key is a placeholder
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("YOUR")) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    db = firebase.firestore();
    isFirebaseConnected = true;
    console.log("Firebase connection successful. App is in Live Mode.");
  } else {
    throw new Error("Firebase API key is a placeholder or Firebase SDK not loaded.");
  }
} catch (error) {
  console.warn("Firebase connection failed. App will run in simulation mode.", error.message);
  isFirebaseConnected = false;
  auth = null;
  db = null;
}

export { auth, db, isFirebaseConnected };
