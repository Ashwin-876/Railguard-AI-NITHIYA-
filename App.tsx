
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Monitoring from './components/Monitoring';
import Chatbot from './components/Chatbot';
import Emergency from './components/Emergency';
import Analytics from './components/Analytics';
import Incidents from './components/Incidents';
import Alerts from './components/Alerts';
import LiveMap from './components/LiveMap';
import Profile from './components/Profile';
import { UserRole } from './types';

// Simple Router Hook Implementation
const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [currentPath, setCurrentPath] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStation, setCurrentStation] = useState("Coimbatore Junction");

  // Mock Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    // ... login screen (unchanged) works because we return early
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="bg-blue-600 p-8 text-center">
            <h1 className="text-white text-3xl font-black tracking-tight">RailGuard <span className="text-blue-200">AI</span></h1>
            <p className="text-blue-100 text-sm mt-2 font-medium">Railway Safety Management System</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Your Role</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
              >
                <option value="Admin">Station Manager</option>
                <option value="Security">Security Personnel</option>
                <option value="EmergencyResponder">Emergency Responder</option>
                <option value="Passenger">Passenger Assistance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Passcode / Identity ID</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
              Access Secure Console
            </button>
            <div className="text-center pt-4">
              <a href="#" className="text-sm text-slate-400 hover:text-blue-600">Forgot credentials? Contact HQ</a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPath) {
      case 'dashboard':
        return <Dashboard />;
      case 'monitoring':
        return <Monitoring />;
      case 'chatbot':
        return <Chatbot />;
      case 'emergency':
        return <Emergency />;
      case 'analytics':
        return <Analytics />;
      case 'incidents':
        return <Incidents />;
      case 'alerts':
        return <Alerts />;
      case 'live-map':
        return <LiveMap currentStation={currentStation} />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <i className="fa-solid fa-hammer text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Section Under Construction</h2>
            <p className="text-slate-500">The <strong>{currentPath.replace('-', ' ')}</strong> module is being calibrated for safety standards.</p>
            <button onClick={() => setCurrentPath('dashboard')} className="text-blue-600 font-bold hover:underline">Return to Dashboard</button>
          </div>
        );
    }
  };

  return (
    <Layout
      userRole={userRole}
      currentPath={currentPath}
      onNavigate={setCurrentPath}
      onLogout={() => setIsLoggedIn(false)}
      currentStation={currentStation}
      onStationChange={setCurrentStation}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
