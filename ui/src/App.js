import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Submit from './pages/Submit';
import Workspace from './pages/Workspace';
import Notifications from './pages/Notifications';
import APIDocumentation from './pages/APIDocumentation';
import Profile from './pages/Profile';
import SubmissionDetail from './pages/SubmissionDetail';
import About from './pages/About';
import MobileNavigation from './components/MobileNavigation';
import SignInPage from './components/SignIn';
import SignUpPage from './components/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main className={`${isMobile ? 'pb-16' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/submit" element={
              <ProtectedRoute>
                <Submit />
              </ProtectedRoute>
            } />
            <Route path="/workspace/*" element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/api" element={<APIDocumentation />} />
            <Route path="/profile/:id" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/submission/:id" element={<SubmissionDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {isMobile && <MobileNavigation />}
      </div>
    </Router>
  );
}

export default App;
