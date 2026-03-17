import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from './context/AppContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { EventDetails } from './pages/EventDetails';
import { Dashboard } from './pages/Dashboard';
import { EventBuilder } from './pages/EventBuilder';
import { EventAnalytics } from './pages/EventAnalytics';
import { CheckInTool } from './pages/CheckInTool';
import { OrganizationProfile } from './pages/OrganizationProfile';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const App: React.FC = () => {
  return (
    <AppProvider>
      <MemoryRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/event/:id/analytics" element={<EventAnalytics />} />
            <Route path="/event/:id/checkin" element={<CheckInTool />} />
            <Route path="/organization/:id" element={<OrganizationProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-event" element={<EventBuilder />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </MemoryRouter>
    </AppProvider>
  );
};

export default App;