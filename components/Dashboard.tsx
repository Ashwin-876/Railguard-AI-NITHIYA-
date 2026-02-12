
import React, { useEffect, useState } from 'react';
import { MOCK_TRAINS, MOCK_INCIDENTS, STATION_DATA, COLORS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getPredictiveInsights } from '../services/geminiService';

const crowdData = [
  { time: '10:00', density: 45 },
  { time: '11:00', density: 52 },
  { time: '12:00', density: 68 },
  { time: '13:00', density: 85 },
  { time: '14:00', density: 78 },
  { time: '15:00', density: 72 },
];

const Dashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>("Analyzing real-time station data...");

  useEffect(() => {
    const fetchInsight = async () => {
      const result = await getPredictiveInsights(STATION_DATA);
      setInsight(result || "Insight generation delayed.");
    };
    fetchInsight();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-100 to-blue-100/50 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm border border-blue-100 group-hover:bg-blue-50 transition-colors">
              <i className="fa-solid fa-users text-xl"></i>
            </div>
            <span className="text-emerald-600 font-medium text-sm flex items-center bg-white px-2 py-1 rounded-lg border border-emerald-100 shadow-sm">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> +5%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium relative z-10">Crowd Density</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1 relative z-10">{STATION_DATA.crowdDensity}%</p>
          <div className="w-full bg-slate-200 h-2 rounded-full mt-4 overflow-hidden relative z-10">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${STATION_DATA.crowdDensity}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-100 to-red-100/50 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-white text-red-600 rounded-xl shadow-sm border border-red-100 group-hover:bg-red-50 transition-colors">
              <i className="fa-solid fa-triangle-exclamation text-xl"></i>
            </div>
            <span className="text-red-600 font-medium text-sm flex items-center bg-white px-2 py-1 rounded-lg border border-red-100 shadow-sm">
              Active
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium relative z-10">Active Incidents</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1 relative z-10">{STATION_DATA.activeIncidents}</p>
          <p className="text-xs text-slate-500 mt-4 relative z-10">2 Priority dispatched</p>
        </div>

        <div className="bg-gradient-to-br from-slate-100 to-emerald-100/50 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-white text-emerald-600 rounded-xl shadow-sm border border-emerald-100 group-hover:bg-emerald-50 transition-colors">
              <i className="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <span className="text-emerald-600 font-medium text-sm flex items-center bg-white px-2 py-1 rounded-lg border border-emerald-100 shadow-sm">
              High
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium relative z-10">Safety Score</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1 relative z-10">{STATION_DATA.safetyScore}/100</p>
          <p className="text-xs text-slate-500 mt-4 relative z-10">Based on AI protocols</p>
        </div>

        <div className="bg-gradient-to-br from-slate-100 to-orange-100/50 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-white text-orange-600 rounded-xl shadow-sm border border-orange-100 group-hover:bg-orange-50 transition-colors">
              <i className="fa-solid fa-train text-xl"></i>
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium relative z-10">Trains in Transit</h3>
          <p className="text-2xl font-bold text-slate-800 mt-1 relative z-10">{MOCK_TRAINS.length}</p>
          <p className="text-xs text-slate-500 mt-4 relative z-10">Next: Rajdhani Exp (10m)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Crowd Graph */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800">Passenger Flow Analytics</h2>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 outline-none">
              <option>Last 6 Hours</option>
              <option>Last 24 Hours</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crowdData}>
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
                <Area type="monotone" dataKey="density" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorDensity)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Prediction Widget */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-800 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-brain text-white"></i>
            </div>
            <h2 className="text-lg font-bold">Predictive AI</h2>
          </div>
          <div className="space-y-6">
            <p className="text-slate-300 leading-relaxed italic">
              "{insight}"
            </p>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Recommended Action</h4>
              <p className="text-sm text-slate-300">Increase security patrols at Entrance Gate A due to predicted influx from upcoming arrivals.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Train Status */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Real-time Train Movement</h2>
          <div className="space-y-4">
            {MOCK_TRAINS.map((train) => (
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
