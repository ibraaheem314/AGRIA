import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardLayout from './components/layout/DashboardLayout';
import MarketingLayout from './components/layout/MarketingLayout';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Home from './pages/Home';
import Contact from './pages/Contact';
import WhyAgriTech from './pages/WhyAgriTech';
import Login from './pages/Login';
import Platform from './pages/Platform';
import About from './pages/About';

import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Marketplace from './pages/Marketplace';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import WeatherPage from './pages/WeatherPage';

import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* 🌿 Marketing public pages */}
        <Route element={<MarketingLayout />}>
          <Route index element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/why" element={<WhyAgriTech />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Route>

          {/* 📊 Dashboard app pages - protected routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/resources" element={<Resources />} />
            <Route path="/weather" element={<WeatherPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 🔍 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
