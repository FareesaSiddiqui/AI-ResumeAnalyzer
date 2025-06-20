import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import LandingPage from './components/LandingPage';
// import AuthModal from './components/AuthModal'; // still not routed directly

// ✅ Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/land" replace />;
};

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen py-10">
        <Routes>
          {/* 👇 Protected route for main app */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ResumeAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route path="/land" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
