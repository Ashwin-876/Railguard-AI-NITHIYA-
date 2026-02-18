
import React, { useEffect, useState } from 'react';
import { MOCK_TRAINS, MOCK_INCIDENTS, STATION_DATA, COLORS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getPredictiveInsights } from '../services/geminiService';

const generateInitialData = () => {
  const data = [];
  const now = new Date();
  for (let i = 10; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // Past 10 minutes
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      density: Math.floor(Math.random() * (80 - 40) + 40)
    });
  }
  return data;
};

const Dashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>("Analyzing real-time station data...");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleScan = () => {
    if (!uploadedFile) {
      alert("Please upload an image reference first.");
      return;
    }
    alert(`Initiating global biometric scan for: ${uploadedFile.name}. Searching 4 active feeds...`);
  };

  // Real-time State
  const [stationMetrics, setStationMetrics] = useState(STATION_DATA);
  const [liveCrowdData, setLiveCrowdData] = useState(generateInitialData());
  const [liveTrains, setLiveTrains] = useState(MOCK_TRAINS);

  useEffect(() => {
    const fetchInsight = async () => {
      const result = await getPredictiveInsights(stationMetrics);
      setInsight(result || "Insight generation delayed.");
    };
    fetchInsight();
  }, [stationMetrics]);

  // Simulation Effect
  // Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Deviate Crowd Density
      setStationMetrics(prev => ({
        ...prev,
        crowdDensity: Math.min(100, Math.max(0, prev.crowdDensity + Math.floor(Math.random() * 5) - 2)),
        safetyScore: Math.min(100, Math.max(0, prev.safetyScore + Math.floor(Math.random() * 3) - 1))
      }));

      // 2. Update Graph Data
      setLiveCrowdData(prev => {
        const now = new Date();
        const newTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const lastDensity = prev[prev.length - 1].density;
        const newDensity = Math.min(100, Math.max(20, lastDensity + Math.floor(Math.random() * 10) - 5));

        const newData = [...prev.slice(1), { time: newTime, density: newDensity }];
        return newData;
      });

    }, 3000); // Pulse every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-slate-700 text-blue-400 rounded-xl shadow-sm border border-slate-600 group-hover:bg-slate-600 transition-colors">
              <i className="fa-solid fa-users text-xl"></i>
            </div>
            <span className="text-emerald-400 font-medium text-sm flex items-center bg-slate-700 px-2 py-1 rounded-lg border border-slate-600 shadow-sm">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> +5%
            </span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium relative z-10">Crowd Density</h3>
          <p className="text-2xl font-bold text-white mt-1 relative z-10 transition-all duration-500">{stationMetrics.crowdDensity}%</p>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden relative z-10">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${stationMetrics.crowdDensity}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-slate-700 text-red-400 rounded-xl shadow-sm border border-slate-600 group-hover:bg-slate-600 transition-colors">
              <i className="fa-solid fa-triangle-exclamation text-xl"></i>
            </div>
            <span className="text-red-400 font-medium text-sm flex items-center bg-slate-700 px-2 py-1 rounded-lg border border-slate-600 shadow-sm">
              Active
            </span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium relative z-10">Active Incidents</h3>
          <p className="text-2xl font-bold text-white mt-1 relative z-10">{stationMetrics.activeIncidents}</p>
          <p className="text-xs text-slate-500 mt-4 relative z-10">2 Priority dispatched</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-slate-700 text-emerald-400 rounded-xl shadow-sm border border-slate-600 group-hover:bg-slate-600 transition-colors">
              <i className="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <span className="text-emerald-400 font-medium text-sm flex items-center bg-slate-700 px-2 py-1 rounded-lg border border-slate-600 shadow-sm">
              High
            </span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium relative z-10">Safety Score</h3>
          <p className="text-2xl font-bold text-white mt-1 relative z-10 transition-all duration-500">{stationMetrics.safetyScore}/100</p>
          <p className="text-xs text-slate-500 mt-4 relative z-10">Based on AI protocols</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-slate-700 text-orange-400 rounded-xl shadow-sm border border-slate-600 group-hover:bg-slate-600 transition-colors">
              <i className="fa-solid fa-train text-xl"></i>
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium relative z-10">Trains in Transit</h3>
          <p className="text-2xl font-bold text-white mt-1 relative z-10">{liveTrains.length}</p>
          <p className="text-xs text-slate-500 mt-4 relative z-10">Next: Rajdhani Exp (10m)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Crowd Graph with Predictive Toggle */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Passenger Flow Analytics</h2>
              <p className="text-xs text-slate-500">Real-time & Predictive Density</p>
            </div>
            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
              <button className="px-3 py-1.5 text-xs font-bold rounded-md bg-white text-blue-600 shadow-sm transition-all">Live</button>
              <button className="px-3 py-1.5 text-xs font-bold rounded-md text-slate-500 hover:text-slate-700 transition-all">Predictive (AI)</button>
            </div>
          </div>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveCrowdData}>
                <defs>
                  <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="density" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorDensity)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Lost & Found Scanner */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 text-white relative overflow-hidden flex flex-col">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="flex items-center space-x-3 mb-6 relative z-10">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
              <i className="fa-solid fa-person-circle-question text-white"></i>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide">AI Lost & Found</h2>
              <p className="text-[10px] text-purple-300">Biometric & Object Scan</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between relative z-10 space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Upload reference image to scan all active camera feeds for matching persons or luggage.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*.jpg,.jpeg,.png"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group ${uploadedFile ? 'border-purple-400 bg-purple-500/10' : 'border-slate-600 hover:border-purple-400 hover:bg-white/5'}`}
              >
                {uploadedFile ? (
                  <>
                    <i className="fa-solid fa-check-circle text-2xl text-purple-400 mb-2"></i>
                    <span className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">{uploadedFile.name}</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-500 group-hover:text-purple-400 mb-2"></i>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-white">Drop Evidence Here</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleScan}
              disabled={!uploadedFile}
              className={`w-full py-3 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center ${uploadedFile ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/50' : 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'}`}
            >
              <i className={`fa-solid ${uploadedFile ? 'fa-radar animate-pulse' : 'fa-lock'} mr-2`}></i>
              {uploadedFile ? 'Initiate Global Scan' : 'Upload Image First'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Train Status */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            Real-time Train Movement
            <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </h2>
          <div className="space-y-4">
            {liveTrains.map((train) => (
              <div key={train.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${train.status === 'Delayed' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    <i className="fa-solid fa-train"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{train.name}</h4>
                    <p className="text-xs text-slate-500">Platform {train.platform} • ID: {train.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${train.status === 'Delayed' ? 'bg-orange-100 text-orange-700' :
                    train.status === 'Arrived' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {train.status}
                  </span>
                  <p className="text-sm font-bold text-slate-800 mt-1">{train.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Critical Incidents</h2>
            <button className="text-blue-600 text-sm font-semibold">View All</button>
          </div>
          <div className="space-y-4">
            {MOCK_INCIDENTS.map((incident) => (
              <div key={incident.id} className="p-4 rounded-xl border-l-4 border-l-red-500 bg-red-50/30 flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                  <i className={`fa-solid ${incident.type.includes('Medical') ? 'fa-truck-medical' : 'fa-handcuffs'}`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{incident.type}</h4>
                    <span className="text-xs text-slate-400">{incident.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-1">{incident.description}</p>
                  <div className="flex items-center mt-3 space-x-3">
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">{incident.severity}</span>
                    <span className="text-xs text-slate-400 flex items-center">
                      <i className="fa-solid fa-location-dot mr-1"></i> {incident.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
