// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TaskManager from './components/TaskManager';
import EmailVerification from './components/EmailVerification';
import AcceptInvitation from './pages/AcceptInvitation';
import TeamJoinedSuccess from './components/TeamJoinedSuccess';
import ProtectedRoute from './components/ProtectedRoute'; // Add this import
import ForgetPassword from './pages/ForgetPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <Router>
      <div className="min-h-screen  bg-white dark:bg-gray-900">
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/verify/:token" element={<EmailVerification />} />
          <Route path="/invite/accept/:token" element={<AcceptInvitation />} />
          
          {/* Protected TaskManager route */}
          <Route 
            path="/taskManager" 
            element={
              <ProtectedRoute>
                <TaskManager />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/team-joined" element={<TeamJoinedSuccess />} />
        </Routes>
        {/* <Footer /> */}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;