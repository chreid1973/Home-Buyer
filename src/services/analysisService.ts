// @ts-nocheck
import { db, isFirebaseConnected } from '../firebaseConfig';
import { AnalysisResult, User } from '../types';

// --- Start of Simulation Logic ---
const getAnalysesKey = (uid: string) => `analyses_${uid}`;

const simulatedSaveAnalysis = async (user: User, analysis: AnalysisResult): Promise<string> => {
    const key = getAnalysesKey(user.uid);
    const analyses = await simulatedGetAnalysesForUser(user);
    const newAnalysis = {
        ...analysis,
        id: `sim_${Date.now()}`,
        savedAt: new Date().toISOString(),
    };
    analyses.unshift(newAnalysis); // Add to the beginning
    localStorage.setItem(key, JSON.stringify(analyses));
    return newAnalysis.id;
};

const simulatedGetAnalysesForUser = async (user: User): Promise<AnalysisResult[]> => {
    try {
        const key = getAnalysesKey(user.uid);
        const analysesJson = localStorage.getItem(key);
        return analysesJson ? JSON.parse(analysesJson) : [];
    } catch {
        return [];
    }
};

const simulatedDeleteAnalysis = async (user: User, analysisId: string): Promise<void> => {
    const key = getAnalysesKey(user.uid);
    let analyses = await simulatedGetAnalysesForUser(user);
    analyses = analyses.filter(a => a.id !== analysisId);
    localStorage.setItem(key, JSON.stringify(analyses));
};
// --- End of Simulation Logic ---

let analysisServiceImpl;

if (isFirebaseConnected && db) {
    console.log("Analysis service is in Live Mode.");
    analysisServiceImpl = {
        saveAnalysis: async (user: User, analysis: AnalysisResult): Promise<string> => {
            try {
                const { id, ...analysisData } = analysis;
                const docRef = await db.collection('users').doc(user.uid).collection('analyses').add({
                    ...analysisData,
                    savedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
                return docRef.id;
            } catch (error) {
                console.error("Error saving analysis:", error);
                throw new Error("Could not save analysis.");
            }
        },
        getAnalysesForUser: async (user: User): Promise<AnalysisResult[]> => {
            try {
                const snapshot = await db.collection('users').doc(user.uid).collection('analyses').orderBy('savedAt', 'desc').get();
                return snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    savedAt: doc.data().savedAt?.toDate().toISOString(),
                } as AnalysisResult));
            } catch (error) {
                console.error("Error fetching analyses:", error);
                throw new Error("Could not fetch analyses.");
            }
        },
        deleteAnalysis: async (user: User, analysisId: string): Promise<void> => {
            try {
                await db.collection('users').doc(user.uid).collection('analyses').doc(analysisId).delete();
            } catch (error) {
                console.error("Error deleting analysis:", error);
                throw new Error("Could not delete analysis.");
            }
        },
    };
} else {
    console.warn("Analysis service is in Simulation Mode.");
    analysisServiceImpl = {
        saveAnalysis: simulatedSaveAnalysis,
        getAnalysesForUser: simulatedGetAnalysesForUser,
        deleteAnalysis: simulatedDeleteAnalysis,
    };
}

export const analysisService = analysisServiceImpl;
