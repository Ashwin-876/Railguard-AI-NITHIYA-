
import React, { useState, useEffect } from 'react';
import { getSafetyBriefing } from '../services/geminiService';

interface AlertItem {
  id: string;
  title: string;
  type: 'Crowd' | 'Security' | 'Environmental' | 'Technical';
  severity: 'Critical' | 'Warning' | 'Advisory';
  time: string;
  source: string;
  description: string;
  acknowledged: boolean;
}

const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'ALR-772',
    title: 'Anomalous Loitering Detected',
    type: 'Security',
    severity: 'Warning',
    time: '14:55',
    source: 'AI-Cam 12',
    description: 'Individual has remained in the non-passenger zone for over 15 minutes without movement.',
    acknowledged: false
  },
  {
    id: 'ALR-773',
    title: 'Platform 4 Density Threshold',
    type: 'Crowd',
    severity: 'Critical',
    time: '15:10',
    source: 'FlowSensor-B',
    description: 'Crowd density exceeded 4 persons per sqm. Potential for stampede during arrival of Rajdhani Exp.',
    acknowledged: false
  },
  {
    id: 'ALR-774',
    title: 'High CO2 Levels - Tunnel A',
    type: 'Environmental',
    severity: 'Warning',
    time: '15:12',
    source: 'Env-Monitor-04',
    description: 'CO2 concentration above 1000ppm. Ventilation system B2 triggered at 50% capacity.',
    acknowledged: true
  },
  {
    id: 'ALR-775',
    title: 'Escalator E-4 Stoppage',
    type: 'Technical',
    severity: 'Advisory',
    time: '15:20',
    source: 'System Diagnostic',
    description: 'Emergency stop button triggered. No entrapment reported. Maintenance dispatched.',
    acknowledged: false
  }
];

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [briefing, setBriefing] = useState<string>("Generating briefing from active alert stream...");
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning'>('All');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    setIsBroadcasting(true);
    // Simulate network delay for effect
    setTimeout(() => {
      // In a real app, this would send to an API
      console.log(`BROADCASTING RED ALERT: ${broadcastMessage}`);
      alert(` EMERGENCY ALERT DEPLOYED:\n\n"${broadcastMessage}"\n\nAll station screens update immediately.`);
      setBroadcastMessage('');
      setIsBroadcasting(false);
    }, 1500);
  };

  useEffect(() => {
    const fetchBriefing = async () => {
      setIsBriefingLoading(true);
      const activeAlerts = alerts.filter(a => !a.acknowledged);
      const summary = await getSafetyBriefing(activeAlerts);
      setBriefing(summary || "No critical alerts requiring immediate shift action.");
      setIsBriefingLoading(false);
    };
    fetchBriefing();
  }, [alerts]);

  const toggleAck = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: !a.acknowledged } : a));
  };

  const filteredAlerts = filter === 'All'
    ? alerts
    : alerts.filter(a => a.severity === filter);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 p-5 rounded-2xl shadow-sm border border-blue-100 flex items-center space-x-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
          <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-50 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-bell text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Total Alerts</p>
            <h4 className="text-xl font-black text-slate-800">{alerts.length}</h4>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-5 rounded-2xl shadow-sm border border-red-100 flex items-center space-x-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
          <div className="w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center shadow-sm border border-red-50 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-burst text-lg animate-pulse"></i>
          </div>
          <div>
            <p className="text-[10px] font-bold text-red-800/60 uppercase tracking-widest group-hover:text-red-700 transition-colors">Active Critical</p>
            <h4 className="text-xl font-black text-slate-800">{alerts.filter(a => a.severity === 'Critical' && !a.acknowledged).length}</h4>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 rounded-2xl shadow-sm border border-orange-100 flex items-center space-x-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
          <div className="w-12 h-12 bg-white text-orange-600 rounded-xl flex items-center justify-center shadow-sm border border-orange-50 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] font-bold text-orange-800/60 uppercase tracking-widest group-hover:text-orange-700 transition-colors">Active Warnings</p>
            <h4 className="text-xl font-black text-slate-800">{alerts.filter(a => a.severity === 'Warning' && !a.acknowledged).length}</h4>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 rounded-2xl shadow-sm border border-emerald-100 flex items-center space-x-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
          <div className="w-12 h-12 bg-white text-emerald-600 rounded-xl flex items-center justify-center shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-check-double text-lg"></i>
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest group-hover:text-emerald-700 transition-colors">Acknowledged</p>
            <h4 className="text-xl font-black text-slate-800">{alerts.filter(a => a.acknowledged).length}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Alerts List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">System Notification Stream</h2>
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              {['All', 'Critical', 'Warning'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className={`bg-white p-5 rounded-2xl shadow-sm border transition-all flex items-start space-x-4 ${alert.acknowledged ? 'opacity-60 border-gray-100' : 'border-gray-100 hover:border-blue-200'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${alert.severity === 'Critical' ? 'bg-red-50 text-red-600' :
                  alert.severity === 'Warning' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                  <i className={`fa-solid ${alert.type === 'Security' ? 'fa-user-shield' :
                    alert.type === 'Crowd' ? 'fa-people-group' :
                      alert.type === 'Environmental' ? 'fa-leaf' : 'fa-cog'
                    }`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900">{alert.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {alert.source}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${alert.severity === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                        alert.severity === 'Warning' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleAck(alert.id)}
                      className={`text-[10px] font-bold uppercase tracking-widest flex items-center transition-colors ${alert.acknowledged ? 'text-emerald-600' : 'text-slate-400 hover:text-blue-600'
                        }`}
                    >
                      <i className={`fa-solid ${alert.acknowledged ? 'fa-check-double' : 'fa-check'} mr-1.5`}></i>
                      {alert.acknowledged ? 'Acknowledged' : 'Mark Clear'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Briefing & Actions Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-bolt-lightning text-white"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold leading-tight">AI Safety Briefing</h3>
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Shift Intel</p>
                </div>
              </div>

              <div className={`p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 ${isBriefingLoading ? 'animate-pulse' : ''}`}>
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  "{briefing}"
                </p>
              </div>

              <div className="mt-6 flex flex-col space-y-3">
                <button className="w-full py-3 bg-white text-slate-900 text-xs font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center">
                  <i className="fa-solid fa-share-nodes mr-2"></i> Broadcast to Staff
                </button>
                <button className="w-full py-3 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center border border-white/10">
                  <i className="fa-solid fa-file-pdf mr-2"></i> Export Shift Log
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-tower-broadcast text-blue-600 mr-2 text-sm"></i>
              Emergency Broadcast
            </h4>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Type urgent notification for station display..."
              className="w-full bg-slate-50 border border-gray-100 rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-red-500 transition-all min-h-[100px] resize-none"
            ></textarea>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={handleBroadcast}
                disabled={isBroadcasting || !broadcastMessage.trim()}
                className={`flex-1 py-2.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-700 shadow-lg shadow-red-100 transition-all flex items-center justify-center ${isBroadcasting || !broadcastMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isBroadcasting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Deploying...
                  </>
                ) : (
                  'Deploy Red Alert'
                )}
              </button>
              <button
                onClick={() => alert("Voice input module requires microphone permission.")}
                className="p-2.5 bg-slate-100 text-slate-400 rounded-lg hover:text-slate-600 transition-colors"
                title="Voice Input"
              >
                <i className="fa-solid fa-microphone"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
