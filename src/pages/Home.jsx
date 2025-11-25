import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Register from '../components/Register';
import Login from '../components/Login';
import EmailVerificationModal from '../components/EmailVerificationModal';
import { useAppSelector } from '../store/hooks';

const Home = () => {
    const location = useLocation();
    const { showVerificationModal } = useAppSelector(state => state.auth);
    
    // Check URL params for mode
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');
    
    // Default to login, but respect URL param and invitation state
    const [isLogin, setIsLogin] = useState(() => {
        if (mode === 'signup') return false;
        if (mode === 'login') return true;
        return true; // Default to login
    });

    // Update state when URL changes (for invitation redirects)
    useEffect(() => {
        if (mode === 'signup') {
            setIsLogin(false);
        } else if (mode === 'login') {
            setIsLogin(true);
        }
    }, [mode]);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    // If verification modal is shown, force login view
    const shouldShowLogin = isLogin || showVerificationModal;

    return (
        <div className=''>
            <div className="max-w-6xl mx-auto">
                {/* Conditional Rendering */}
                {shouldShowLogin ? (
                    <Login onToggleForm={toggleForm} />
                ) : (
                    <Register onToggleForm={toggleForm} />
                )}
                
                {/* Email Verification Modal */}
                <EmailVerificationModal />
            </div>
        </div>
    );
};

export default Home;