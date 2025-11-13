import React, { useState } from 'react';
import Register from '../components/Register';
import Login from '../components/Login';

const Home = () => {
    const [isLogin, setIsLogin] = useState(true); // Start with Login by default

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className=''>
            <div className="max-w-6xl mx-auto">
                {/* Conditional Rendering */}
                {isLogin ? (
                    <Login onToggleForm={toggleForm} />
                ) : (
                    <Register onToggleForm={toggleForm} />
                )}
            </div>
        </div>
    );
};

export default Home; 