// @ts-nocheck
import { db, isFirebaseConnected } from '../firebaseConfig';
import { AnalysisResult, User } from '../types';

const saveAnalysis = async (user: User, analysis: AnalysisResult): Promise<string> => {
    if (!isFirebaseConnected || !db) {
        console.warn("Database service is in simulation mode. Analysis not saved.");
        return Promise.resolve("simulated_id");
    }
    try {
        const { id, ...analysisData } = analysis; // Exclude id from data being saved
        const docRef = await db.collection('users').doc(user.uid).collection('analyses').add({
            ...analysisData,
            savedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving analysis:", error);
        throw new Error("Could not save analysis.");
    }
};

const getAnalysesForUser = async (user: User): Promise<AnalysisResult[]> => {
    if (!isFirebaseConnected || !db) {
        console.warn("Database service is in simulation mode. No analyses fetched.");
        return [];
    }
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
};

const deleteAnalysis = async (user: User, analysisId: string): Promise<void> => {
    if (!isFirebaseConnected || !db) {
        console.warn("Database service is in simulation mode. Analysis not deleted.");
        return;
    }
    try {
        await db.collection('users').doc(user.uid).collection('analyses').doc(analysisId).delete();
    } catch (error) {
        console.error("Error deleting analysis:", error);
        throw new Error("Could not delete analysis.");
    }
};

export const analysisService = {
    saveAnalysis,
    getAnalysesForUser,
    deleteAnalysis,
};
