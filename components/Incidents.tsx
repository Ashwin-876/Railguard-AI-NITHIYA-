
import React, { useState, useEffect } from 'react';
import { MOCK_INCIDENTS } from '../constants';
import { Incident } from '../types';
import { getIncidentProtocols } from '../services/geminiService';

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(MOCK_INCIDENTS[0]);
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Critical'>('All');
  const [aiProtocol, setAiProtocol] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showUpdateLogModal, setShowUpdateLogModal] = useState(false);
  const [newLogEntry, setNewLogEntry] = useState("");
  const [newIncident, setNewIncident] = useState({
    type: '',
    location: '',
    severity: 'Medium',
    description: ''
  });

  const handleLogIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const incident: Incident = {
      id: `INC-${Math.floor(Math.random() * 1000)}`,
      type: newIncident.type,
      location: newIncident.location,
      severity: newIncident.severity as 'Critical' | 'High' | 'Medium' | 'Low',
      status: 'Reported',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: newIncident.description,
      logs: [`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Incident reported.`]
    };
    setIncidents([incident, ...incidents]);
    setShowLogModal(false);
    setNewIncident({ type: '', location: '', severity: 'Medium', description: '' });
  };

  useEffect(() => {
    if (selectedIncident) {
      const fetchProtocols = async () => {
        setIsAiLoading(true);
        setCheckedItems([]); // Reset checked items
        setAiProtocol("Generating safety checklist...");
        const result = await getIncidentProtocols(selectedIncident);
        setAiProtocol(result || "Safety protocols unavailable.");
        setIsAiLoading(false);
      };
      fetchProtocols();
    }
  }, [selectedIncident]);

  const handleReanalyze = async () => {
    if (!selectedIncident) return;
    setIsAiLoading(true);
    setCheckedItems([]);
    setAiProtocol("Re-evaluating incident context...");
    // Simulate delay or call API again
    const result = await getIncidentProtocols(selectedIncident);
    setAiProtocol(result || "Safety protocols unavailable.");
    setIsAiLoading(false);
  };

  const toggleCheckItem = (index: number) => {
    setCheckedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

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

          <button
            onClick={() => setShowLogModal(true)}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 mb-4"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Log New Incident</span>
          </button>

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
                    <button
                      onClick={() => setShowUpdateLogModal(true)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Update Log
                    </button>
                  </div>

                  {/* Incident Logs Display */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-[10px] text-slate-400 font-bold uppercase mb-3">Live Incident Log</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedIncident.logs && selectedIncident.logs.length > 0 ? (
                        selectedIncident.logs.map((log, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{log}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No updates recorded yet.</p>
                      )}
                    </div>
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
                    {aiProtocol.split('\n').filter(line => line.trim().length > 0).map((line, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleCheckItem(idx)}
                        className={`flex items-start space-x-3 cursor-pointer group p-2 rounded-lg transition-all ${checkedItems.includes(idx) ? 'bg-blue-900/20' : 'hover:bg-slate-800'}`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all ${checkedItems.includes(idx) ? 'bg-blue-500 border-blue-500' : 'border-slate-600 group-hover:border-blue-400'}`}>
                          {checkedItems.includes(idx) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                        </div>
                        <p className={`text-[11px] font-medium leading-relaxed transition-colors ${checkedItems.includes(idx) ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                          {line.replace(/^\d+\.\s*/, '').replace(/^- /, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleReanalyze}
                    disabled={isAiLoading}
                    className="mt-6 w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-[10px] font-bold rounded-lg transition-all border border-blue-600/30 flex items-center justify-center"
                  >
                    {isAiLoading ? <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> : null}
                    {isAiLoading ? 'ANALYZING...' : 'RE-ANALYZE INCIDENT'}
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
      {/* Log Incident Modal */}
      {
        showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Log New Incident</h3>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleLogIncident} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Incident Type</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. Medical Emergency, Security Breach"
                    value={newIncident.type}
                    onChange={e => setNewIncident({ ...newIncident, type: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Location</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. Platform 4, Entrance A"
                    value={newIncident.location}
                    onChange={e => setNewIncident({ ...newIncident, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Severity</label>
                  <select
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newIncident.severity}
                    onChange={e => setNewIncident({ ...newIncident, severity: e.target.value })}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label>
                  <textarea
                    required
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] resize-none"
                    placeholder="Describe the incident details..."
                    value={newIncident.description}
                    onChange={e => setNewIncident({ ...newIncident, description: e.target.value })}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  Submit Incident Report
                </button>
              </form>
            </div>
          </div>
        )}

      {/* Update Log Modal */}
      {showUpdateLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fadeIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add Log Entry</h3>
              <button
                onClick={() => setShowUpdateLogModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] resize-none"
                placeholder="Enter update details..."
                value={newLogEntry}
                onChange={e => setNewLogEntry(e.target.value)}
              ></textarea>
              <button
                onClick={() => {
                  if (newLogEntry.trim() && selectedIncident) {
                    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const entry = `${timestamp} - ${newLogEntry}`;
                    const updatedIncident = {
                      ...selectedIncident,
                      logs: selectedIncident.logs ? [...selectedIncident.logs, entry] : [entry]
                    };
                    // Update both list and selected
                    setIncidents(incidents.map(i => i.id === selectedIncident.id ? updatedIncident : i));
                    setSelectedIncident(updatedIncident);
                    setNewLogEntry("");
                    setShowUpdateLogModal(false);
                  }
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                Post Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;
