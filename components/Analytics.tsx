
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { COLORS } from '../constants';
import { getStrategicAnalysis } from '../services/geminiService';

const incidentDistribution = [
  { name: 'Security', count: 42, color: '#1E40AF' },
  { name: 'Medical', count: 28, color: '#DC2626' },
  { name: 'Technical', count: 15, color: '#EA580C' },
  { name: 'Crowd', count: 56, color: '#059669' },
];

const safetyTrend = [
  { day: 'Mon', score: 88 },
  { day: 'Tue', score: 92 },
  { day: 'Wed', score: 90 },
  { day: 'Thu', score: 85 },
  { day: 'Fri', score: 89 },
  { day: 'Sat', score: 94 },
  { day: 'Sun', score: 92 },
];

const Analytics: React.FC = () => {
  const [strategicOutlook, setStrategicOutlook] = useState<string>("Synthesizing historical safety data...");
  const [activeTab, setActiveTab] = useState('30days');

  useEffect(() => {
    const fetchStrategy = async () => {
      const result = await getStrategicAnalysis({ incidentTrend: 'declining', safetyScore: 92 });
      setStrategicOutlook(result || "Strategic insights are being recalibrated.");
    };
    fetchStrategy();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Safety Intelligence</h2>
          <p className="text-slate-500 text-sm">Long-term performance & strategic forecasting</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          {['7days', '30days', '90days'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              {tab.replace('days', ' Days')}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-colors">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Response Time</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-slate-900">4m 12s</h3>
            <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              <i className="fa-solid fa-caret-down mr-1"></i> 18% Better
            </span>
          </div>
          <div className="mt-4 flex space-x-1 h-1">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-100 group-hover:bg-blue-600 transition-all rounded-full" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-emerald-200 transition-colors">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mitigation Rate</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-slate-900">98.4%</h3>
            <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              Within SLA
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-orange-200 transition-colors">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Staff Readiness</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-slate-900">High</h3>
            <span className="text-blue-500 text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg">
              Full Drills Completed
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/32?u=1" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
              <img src="https://i.pravatar.cc/32?u=2" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
              <img src="https://i.pravatar.cc/32?u=3" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
            </div>
            <span className="text-[10px] text-slate-500 font-bold">+120 Officers Alert</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incident Bar Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-slate-800">Incident Distribution</h4>
            <i className="fa-solid fa-ellipsis text-slate-300"></i>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {incidentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Safety Trend Area Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-slate-800">Safety Index Trend</h4>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="text-[10px] font-bold text-slate-500">Target 90+</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={safetyTrend}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis hide domain={[70, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#1E40AF" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Visual (CSS Grid Representation) */}
        <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-slate-800 mb-6">Congestion Heatmap</h4>
          <div className="grid grid-cols-5 gap-1 aspect-square">
            {Array.from({ length: 25 }).map((_, i) => {
              const intensity = [0, 0, 1, 2, 0, 0, 3, 4, 1, 0, 1, 4, 4, 2, 0, 0, 2, 2, 1, 0, 0, 0, 1, 0, 0][i];
              const colors = ['bg-slate-50', 'bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-800'];
              return (
                <div
                  key={i}
                  className={`${colors[intensity]} rounded-md transition-all hover:scale-110 cursor-help border border-white`}
                  title={`Zone ${i + 1}: Intensity Level ${intensity}`}
                ></div>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>LOW CONGESTION</span>
            <span>HIGH SURGE</span>
          </div>
        </div>

        {/* Gemini Strategic AI Card */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900">
                <i className="fa-solid fa-chess-knight text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Strategic Safety Outlook</h3>
                <p className="text-blue-400 text-xs font-semibold tracking-wider uppercase">Advanced Safety Analysis</p>
              </div>
            </div>

            <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-slate-300 italic leading-relaxed whitespace-pre-wrap">
                  {strategicOutlook}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="bg-blue-900/40 text-blue-300 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-blue-800/50">#InfrastructureRefinement</span>
              <span className="bg-slate-800/40 text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-700/50">#Q4Forecast</span>
              <span className="bg-emerald-900/40 text-emerald-300 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-emerald-800/50">#SecurityOptimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
