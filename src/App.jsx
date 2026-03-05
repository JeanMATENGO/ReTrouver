import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import FormPage from './pages/FormPage';
import AdsPage from './pages/AdsPage';
import Login from './pages/Login';

// Composant pour protéger l'accès à la page de déclaration
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/declarer/:type"
            element={
              <PrivateRoute>
                <FormPage />
              </PrivateRoute>
            }
          />
          <Route path="/annonces" element={<AdsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
