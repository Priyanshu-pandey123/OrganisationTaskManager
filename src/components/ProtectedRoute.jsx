// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  
  // Check both Redux state and localStorage for token
  const authToken = token || localStorage.getItem('auth_token');
  const isLoggedIn = isAuthenticated && authToken;

  if (!isLoggedIn) {
    // Redirect to home page (login) with return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;