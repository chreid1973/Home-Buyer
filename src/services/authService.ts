// @ts-nocheck
import { auth, isFirebaseConnected } from '../firebaseConfig';
import { User } from '../types';

const onAuthStateChanged = (callback: (user: User | null) => void) => {
    if (!isFirebaseConnected || !auth) {
        console.warn("Auth service is in simulation mode.");
        callback(null);
        return () => {}; // Return an empty unsubscribe function
    }

    return auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
            const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
            };
            callback(user);
        } else {
            callback(null);
        }
    });
};

const loginWithGoogle = async () => {
    if (!isFirebaseConnected || !auth) {
        alert("Authentication is not available in simulation mode.");
        return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        alert(`Sign-in failed: ${error.message}`);
    }
};

const logout = () => {
    if (isFirebaseConnected && auth) {
        return auth.signOut();
    }
    console.warn("Attempted to logout in simulation mode.");
    return Promise.resolve();
};

export const authService = {
    onAuthStateChanged,
    loginWithGoogle,
    logout,
};
