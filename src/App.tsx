import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Shared Layouts
import DashboardLayout from './features/dashboard/DashboardLayout';

// Feature Pages
import Dashboard from './features/dashboard/Dashboard';
import AIAssistant from './features/ai/components/AIAssistant';

// Landing Page
import Home from './pages/Home';

// Auth Pages
import Login from './pages/Login';

// Other Pages
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Global Components */}
      <AIAssistant />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weather" element={<div>Weather page coming soon</div>} />
          <Route path="/maps" element={<div>Maps page coming soon</div>} />
          <Route path="/analytics" element={<div>Analytics page coming soon</div>} />
          <Route path="/crops" element={<div>Crops page coming soon</div>} />
          <Route path="/farms" element={<div>Farms page coming soon</div>} />
          <Route path="/team" element={<div>Team page coming soon</div>} />
          <Route path="/community" element={<div>Community page coming soon</div>} />
          <Route path="/settings" element={<div>Settings page coming soon</div>} />
          <Route path="/help" element={<div>Help page coming soon</div>} />
        </Route>
        
        {/* Fallback Routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
