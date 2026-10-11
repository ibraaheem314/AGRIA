import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SimpleLayout from './components/layout/SimpleLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import WeatherPage from './pages/WeatherPage';
import ChatPage from './pages/ChatPage';
import ConsultantsPage from './pages/ConsultantsPage';
import MarketplacePage from './pages/MarketplacePage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SimpleLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="contact" element={<ContactPage />} />
              
              {/* Routes protégées - Nécessitent une connexion */}
              <Route 
                path="weather" 
                element={
                  <ProtectedRoute>
                    <WeatherPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="consultants" 
                element={
                  <ProtectedRoute>
                    <ConsultantsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="marketplace" 
                element={
                  <ProtectedRoute>
                    <MarketplacePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="chat" 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
