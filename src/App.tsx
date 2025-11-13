import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TaskManager from './components/TaskManager';
import EmailVerification from './components/EmailVerification';

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/verify/:token" element={<EmailVerification />} />
          <Route path="/taskManager" element={<TaskManager />} />
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
