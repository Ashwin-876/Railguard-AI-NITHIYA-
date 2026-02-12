
import React, { useState } from 'react';
import { UserRole } from '../types';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, currentPath, onNavigate, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: 'fa-chart-pie', path: 'dashboard' },
    { name: 'Monitoring', icon: 'fa-video', path: 'monitoring' },
    { name: 'Emergency', icon: 'fa-circle-exclamation', path: 'emergency', highlight: true },
    { name: 'Analytics', icon: 'fa-magnifying-glass-chart', path: 'analytics' },
    { name: 'Incidents', icon: 'fa-file-invoice', path: 'incidents' },
    { name: 'AI Chatbot', icon: 'fa-robot', path: 'chatbot' },
    { name: 'Alerts', icon: 'fa-bell', path: 'alerts' },
    { name: 'Profile', icon: 'fa-user', path: 'profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col shadow-xl z-20`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="text-white font-bold text-xl tracking-tight">RailGuard <span className="text-blue-400">AI</span></span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white transition-colors">
            <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-bars'}`}></i>
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                currentPath === item.path 
                  ? 'bg-blue-600 text-white' 
                  : item.highlight 
                    ? 'text-orange-400 hover:bg-slate-800' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-6 text-center`}></i>
              {isSidebarOpen && <span className="ml-4 font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-slate-400 hover:bg-red-900/30 hover:text-red-400 rounded-lg transition-all"
          >
            <i className="fa-solid fa-right-from-bracket w-6 text-center"></i>
            {isSidebarOpen && <span className="ml-4 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-slate-800 capitalize">
              {currentPath.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span>Live: New Delhi Central</span>
            </div>
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">Officer Arjun</p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
              <img src="https://picsum.photos/40/40" alt="Profile" className="w-10 h-10 rounded-full border border-gray-200" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
