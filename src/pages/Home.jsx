import React, { useState } from 'react';
import Register from '../components/Register';
import Login from '../components/Login';
import EmailVerificationModal from '../components/EmailVerificationModal';
import { useAppSelector } from '../store/hooks';

const Home = () => {
    const [isLogin, setIsLogin] = useState(true); // Start with Login by default
    const { showVerificationModal } = useAppSelector(state => state.auth);

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