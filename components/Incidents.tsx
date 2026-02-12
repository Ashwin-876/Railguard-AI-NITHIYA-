
import React, { useState, useEffect } from 'react';
import { MOCK_INCIDENTS } from '../constants';
import { Incident } from '../types';
import { getIncidentProtocols } from '../services/geminiService';

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(MOCK_INCIDENTS[0]);
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Critical'>('All');
  const [aiProtocol, setAiProtocol] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (selectedIncident) {
      const fetchProtocols = async () => {
        setIsAiLoading(true);
        setAiProtocol("Generating safety checklist...");
        const result = await getIncidentProtocols(selectedIncident);
        setAiProtocol(result || "Safety protocols unavailable.");
        setIsAiLoading(false);
      };
      fetchProtocols();
    }
  }, [selectedIncident]);

  const filteredIncidents = filter === 'All'
    ? incidents
    : incidents.filter(i => i.severity === filter);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'border-l-red-600 bg-red-50 text-red-700';
      case 'High': return 'border-l-orange-500 bg-orange-50 text-orange-700';
      case 'Medium': return 'border-l-blue-500 bg-blue-50 text-blue-700';
      default: return 'border-l-slate-400 bg-slate-50 text-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Closed': return 'bg-emerald-100 text-emerald-700';
      case 'Resolving': return 'bg-blue-100 text-blue-700';
      case 'Dispatched': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Quick Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-fire-flame-curved"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Threats</p>
            <h4 className="text-xl font-black text-slate-900">{incidents.filter(i => i.status !== 'Closed').length}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-bolt"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Response</p>
            <h4 className="text-xl font-black text-slate-900">3.8 mins</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resolved Today</p>
            <h4 className="text-xl font-black text-slate-900">14</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Incident List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Incident Feed</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['All', 'Critical', 'High'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2 custom-scrollbar">
            {filteredIncidents.map(incident => (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={`p-4 rounded-xl border-l-4 transition-all cursor-pointer group ${selectedIncident?.id === incident.id
                    ? `shadow-md ring-1 ring-slate-200 ${getSeverityStyles(incident.severity)}`
                    : 'bg-white border-white hover:border-slate-200'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${incident.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                        incident.severity === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                      <i className={`fa-solid ${incident.type.includes('Medical') ? 'fa-hospital' : 'fa-shield-halved'}`}></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{incident.type}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{incident.id} • {incident.location}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                {selectedIncident?.id === incident.id && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed italic border-t border-black/5 pt-2">
                    {incident.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center space-x-2">
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Log New Incident</span>
          </button>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-5 space-y-6">
          {selectedIncident ? (
            <>
              {/* Context Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-slate-50">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight">Dispatch Details</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Assigned Unit</p>
                      <p className="text-sm font-bold text-slate-800">Security Squad 04</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Time Elapsed</p>
                      <p className="text-sm font-bold text-orange-600">12m 45s</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[10px] text-blue-600 font-bold uppercase mb-2 flex items-center">
                      <i className="fa-solid fa-location-dot mr-1"></i> Precise Coordinates
                    </p>
                    <p className="text-xs text-blue-800 font-medium">New Delhi Central • Platform 4 • Sector B (Waiting Area)</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                      Mark Resolved
                    </button>
                    <button className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">
                      Update Log
                    </button>
                  </div>
                </div>
              </div>

              {/* Gemini Advisor Card */}
              <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <i className="fa-solid fa-brain text-blue-400 text-4xl"></i>
                </div>
                <div className="relative z-10">
                  <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">AI Advisor Checklist</h4>
                  <div className={`space-y-3 ${isAiLoading ? 'animate-pulse opacity-50' : ''}`}>
                    {aiProtocol.split('\n').map((line, idx) => (
                      <div key={idx} className="flex items-start space-x-3 group">
                        <div className="w-5 h-5 rounded-full border border-blue-900 flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:border-blue-500">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-[10px] font-bold rounded-lg transition-all border border-blue-600/30">
                    RE-ANALYZE INCIDENT
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
              <i className="fa-solid fa-mouse-pointer text-slate-300 text-3xl mb-4"></i>
              <h3 className="font-bold text-slate-800">No Incident Selected</h3>
              <p className="text-xs text-slate-500 mt-2">Select an event from the feed to view real-time status and AI protocols.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Incidents;
