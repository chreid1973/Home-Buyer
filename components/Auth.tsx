import React from 'react';
import Modal from './Modal';
import { authService } from '../src/services/authService';

interface AuthProps {
    isOpen: boolean;
    onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ isOpen, onClose }) => {

    const handleGoogleLogin = async () => {
        await authService.loginWithGoogle();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center p-4">
                <h2 className="text-2xl font-bold mb-4 text-white">Login to Save History</h2>
                <p className="text-slate-300 mb-6">
                    Sign in to save your property analyses and view them across devices.
                </p>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors"
                >
                    <svg className="w-5 h-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-4.75 2.04-5.52 0-10-4.48-10-10s4.48-10 10-10c3.1 0 5.19 1.23 6.58 2.55l-2.43 2.43c-.97-.92-2.21-1.64-4.15-1.64-3.46 0-6.28 2.82-6.28 6.28s2.82 6.28 6.28 6.28c2.16 0 3.52-1.08 4.34-1.87.69-.64 1.2-1.64 1.38-2.88H12.48z" fill="#FFFFFF"/></svg>
                    Sign in with Google
                </button>
            </div>
        </Modal>
    );
};

export default Auth;
