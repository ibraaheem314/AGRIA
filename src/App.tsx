import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import DashboardLayout from './components/layout/DashboardLayout';
import MarketingLayout from './components/layout/MarketingLayout';

import Home from './pages/Home';
import Contact from './pages/Contact';
import WhyAgriTech from './pages/WhyAgriTech';

import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Marketplace from './pages/Marketplace';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import WeatherPage from './pages/WeatherPage';

import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌿 Marketing public pages */}
        <Route element={<MarketingLayout />}>
          <Route index element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/why" element={<WhyAgriTech />} />
        </Route>

        {/* 📊 Dashboard app pages */}
        <Route element={<DashboardLayout />}>
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
  );
}

export default App;
