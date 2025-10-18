// @ts-nocheck
import { auth, isFirebaseConnected } from '../firebaseConfig';
import { User } from '../types';

// --- Start of Simulation Logic ---
const SIMULATED_USER_KEY = 'simulated_user';
let onAuthStateChangedCallback: ((user: User | null) => void) | null = null;

const getSimulatedUser = (): User | null => {
    try {
        const userJson = localStorage.getItem(SIMULATED_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch {
        return null;
    }
};

const setSimulatedUser = (user: User | null) => {
    if (user) {
        localStorage.setItem(SIMULATED_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(SIMULATED_USER_KEY);
    }
    if (onAuthStateChangedCallback) {
        onAuthStateChangedCallback(user);
    }
};

const simulatedOnAuthStateChanged = (callback: (user: User | null) => void) => {
    onAuthStateChangedCallback = callback;
    // Immediately notify the listener with the current state
    setTimeout(() => callback(getSimulatedUser()), 0); 
    
    // Return a dummy unsubscribe function
    return () => { 
        onAuthStateChangedCallback = null;
    };
};

const simulatedLoginWithGoogle = async () => {
    const user: User = {
        uid: 'simulated_user_123',
        email: 'tester@simulation.io',
    };
    setSimulatedUser(user);
    alert("Logged in as a simulated user. Your data will be saved in this browser only.");
    return Promise.resolve();
};

const simulatedLogout = () => {
    setSimulatedUser(null);
    return Promise.resolve();
};
// --- End of Simulation Logic ---

let authServiceImpl;

if (isFirebaseConnected && auth) {
    console.log("Auth service is in Live Mode.");
    authServiceImpl = {
        onAuthStateChanged: (callback: (user: User | null) => void) => {
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
        },
        loginWithGoogle: async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                await auth.signInWithPopup(provider);
            } catch (error) {
                console.error("Error during Google sign-in:", error);
                alert(`Sign-in failed: ${error.message}`);
            }
        },
        logout: () => {
            return auth.signOut();
        },
    };
} else {
    console.warn("Auth service is in Simulation Mode.");
    authServiceImpl = {
        onAuthStateChanged: simulatedOnAuthStateChanged,
        loginWithGoogle: simulatedLoginWithGoogle,
        logout: simulatedLogout,
    };
}

export const authService = authServiceImpl;
