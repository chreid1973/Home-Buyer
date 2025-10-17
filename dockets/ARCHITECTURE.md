# Live Backend Architecture Plan: v4.0

**Objective:** To migrate the "Property Scout" application from a client-side simulation to a production-ready, scalable, and secure live backend using Google Cloud services.

---

### **1. Authentication: Firebase Authentication**

- **Service:** We will use Google's **Firebase Authentication** service.
- **Provider:** The primary provider will be **Google Sign-In** for a seamless user experience. Email/Password can be added later if needed.
- **Implementation:**
    1.  The `authService.ts` will be completely refactored. The `localStorage` logic will be removed.
    2.  All methods (`login`, `logout`, `signup`) will be rewritten to call the official Firebase Authentication SDK functions (e.g., `signInWithPopup`, `signOut`).
    3.  The main `App.tsx` component will use the `onAuthStateChanged` real-time listener provided by the Firebase SDK. This is the official best practice and ensures the UI is always perfectly in sync with the user's authentication state.
- **Data Model:** The `User` object in `src/types.ts` will store the `uid` and `email` provided by Firebase. The `uid` is the critical, unique identifier.

---

### **2. Data Persistence: Cloud Firestore**

- **Service:** We will use Google's **Cloud Firestore** NoSQL database.
- **Data Structure:** Data will be stored in a user-centric, sub-collection model to ensure security and scalability. The structure will be:
    ```
    /users/{user.uid}/analyses/{analysis_id}
    ```
    - **`users` (Collection):** Top-level collection.
    - **`{user.uid}` (Document):** A document for each user, identified by their unique Firebase Auth UID. This document can later store user profile information.
    - **`analyses` (Sub-collection):** A sub-collection within each user's document containing all of their saved analyses.
    - **`{analysis_id}` (Document):** A single saved analysis report.
- **Security Rules:** We will implement Firestore Security Rules to enforce that a user can only read and write to their own data within their `/{user.uid}/` path.
    - **Example Rule:** `allow read, write: if request.auth.uid == userId;`
- **Implementation:**
    1.  The `analysisService.ts` will be completely refactored. The `localStorage` logic will be removed.
    2.  `saveAnalysis` will use `addDoc` to create a new document in the user's `analyses` sub-collection. It will also add a `serverTimestamp` for the `savedAt` field.
    3.  `getAnalysesForUser` will query this sub-collection for the currently logged-in user.
    4.  `deleteAnalysis` will use `deleteDoc` to remove a specific analysis document.

---

### **3. Resilience: "Dual-Mode" Architecture**

- **Principle:** The application must remain functional even if the live backend is unavailable (e.g., invalid API key, network error).
- **Implementation:**
    1.  `firebaseConfig.ts` will be responsible for initializing the connection. It will wrap the initialization in a `try...catch` block.
    2.  It will export a boolean flag, `isFirebaseConnected`, indicating the success or failure of the connection attempt.
    3.  Both `authService.ts` and `analysisService.ts` will import this flag. They will each contain **two** implementations: the live Firebase logic and the original `localStorage`-based simulation.
    4.  The services will conditionally export the appropriate implementation based on the `isFirebaseConnected` flag. This ensures the application never crashes due to a backend configuration or connection issue.
