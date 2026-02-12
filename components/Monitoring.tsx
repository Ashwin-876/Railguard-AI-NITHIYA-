
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { getZoneIntelligence } from '../services/geminiService';

interface MapAlert {
  id: string;
  zone: 'waiting' | 'platform' | 'entrance' | 'ticketing';
  type: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  coords: { top: string; left: string; width: string; height: string };
  icon: string;
}

interface HistoricalIncident {
  id: string;
  zone: 'waiting' | 'platform' | 'entrance' | 'ticketing';
  type: string;
  date: string; // YYYY-MM-DD
  description: string;
  coords: { top: string; left: string };
}

interface StationZone {
  id: 'waiting' | 'platform' | 'entrance' | 'ticketing';
  name: string;
  personnel: string[];
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Overcapacity';
  status: 'Normal' | 'Alert' | 'Emergency';
  lastPatrol: string;
}

const HISTORICAL_INCIDENTS: HistoricalIncident[] = [
  { id: 'HIST-001', zone: 'platform', type: 'Slip & Fall', date: '2023-10-20', description: 'Wet surface after cleaning.', coords: { top: '80%', left: '20%' } },
  { id: 'HIST-002', zone: 'platform', type: 'Overcrowding', date: '2023-10-25', description: 'Holiday rush surge.', coords: { top: '78%', left: '60%' } },
  { id: 'HIST-003', zone: 'waiting', type: 'Theft Report', date: '2023-10-15', description: 'Stolen laptop bag.', coords: { top: '25%', left: '15%' } },
  { id: 'HIST-004', zone: 'entrance', type: 'Scanner Failure', date: '2023-10-22', description: 'Baggage scanner downtime.', coords: { top: '45%', left: '48%' } },
  { id: 'HIST-005', zone: 'ticketing', type: 'Verbal Altercation', date: '2023-10-18', description: 'Queue dispute at Counter 4.', coords: { top: '15%', left: '75%' } },
  { id: 'HIST-006', zone: 'platform', type: 'Medical Faint', date: '2023-09-30', description: 'Dehydration case.', coords: { top: '82%', left: '40%' } },
];

const feeds = [
  { id: 1, name: 'Entrance Hall', status: 'Active', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80' },
  { id: 2, name: 'Platform 4', status: 'Alert', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Ticketing Area', status: 'Active', image: 'https://images.unsplash.com/photo-1515165592879-5d7bb22588ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'North Corridor', status: 'Active', image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const zones: StationZone[] = [
  { id: 'waiting', name: 'North Waiting Lounge', personnel: ['Guard Meera'], crowdLevel: 'Moderate', status: 'Normal', lastPatrol: '14:45' },
  { id: 'platform', name: 'Platform 4 (Main)', personnel: ['Officer Arjun', 'Officer Karan'], crowdLevel: 'Overcapacity', status: 'Emergency', lastPatrol: '15:02' },
  { id: 'ticketing', name: 'Ticketing Hall A', personnel: ['Staff Priya'], crowdLevel: 'Low', status: 'Normal', lastPatrol: '14:30' },
  { id: 'entrance', name: 'Main Entrance Gate', personnel: ['Guard Rahul'], crowdLevel: 'High', status: 'Alert', lastPatrol: '15:10' }
];

const mapAlerts: MapAlert[] = [
  { id: 'ALR-001', zone: 'platform', type: 'Crowd Surge', severity: 'Critical', message: 'Platform 4 exceeding 85% capacity.', coords: { top: '75%', left: '10%', width: '80%', height: '15%' }, icon: 'fa-people-group' },
  { id: 'ALR-002', zone: 'waiting', type: 'Medical Alert', severity: 'Warning', message: 'Individual reported distress.', coords: { top: '10%', left: '10%', width: '24%', height: '40%' }, icon: 'fa-truck-medical' },
  { id: 'ALR-003', zone: 'entrance', type: 'Gate Malfunction', severity: 'Info', message: 'Gate G-12 unresponsive.', coords: { top: '50%', left: '45%', width: '10%', height: '10%' }, icon: 'fa-door-closed' }
];



const Monitoring: React.FC = () => {
  const [selectedFeed, setSelectedFeed] = useState<number | null>(null);
  const [activeAlertId, setActiveAlertId] = useState<string | null>('ALR-001');
  const [selectedZoneId, setSelectedZoneId] = useState<'waiting' | 'platform' | 'entrance' | 'ticketing' | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'7' | '30' | 'All'>('30');
  const [showHistory, setShowHistory] = useState(true);

  // AI Intelligence State
  const [zoneInsight, setZoneInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  // Zoom and Pan State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const filteredHistory = useMemo(() => {
    const today = new Date();
    return HISTORICAL_INCIDENTS.filter(item => {
      if (historyFilter === 'All') return true;
      const itemDate = new Date(item.date);
      const diffTime = Math.abs(today.getTime() - itemDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= parseInt(historyFilter);
    });
  }, [historyFilter]);

  const selectedZoneData = zones.find(z => z.id === selectedZoneId);
  const zoneAlerts = useMemo(() => mapAlerts.filter(a => a.zone === selectedZoneId), [selectedZoneId]);
  const zoneHistory = useMemo(() => filteredHistory.filter(h => h.zone === selectedZoneId), [filteredHistory, selectedZoneId]);

  // Trigger AI analysis when zone selection changes
  const fetchIntelligence = useCallback(async () => {
    if (!selectedZoneId || !selectedZoneData) return;
    setIsInsightLoading(true);
    setZoneInsight(null);
    const dataForAI = {
      zone: selectedZoneData.name,
      currentCrowd: selectedZoneData.crowdLevel,
      status: selectedZoneData.status,
      activeAlerts: zoneAlerts.length,
      historicalIncidents: zoneHistory.length,
      latestHistory: zoneHistory.slice(0, 2).map(h => h.type)
    };
    const intelligence = await getZoneIntelligence(dataForAI);
    setZoneInsight(intelligence);
    setIsInsightLoading(false);
  }, [selectedZoneId, selectedZoneData, zoneAlerts.length, zoneHistory]);

  useEffect(() => {
    if (selectedZoneId) {
      fetchIntelligence();
    } else {
      setZoneInsight(null);
    }
  }, [selectedZoneId, fetchIntelligence]);

  // Zoom Handlers
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setSelectedZoneId(null);
  };

  // Pan Handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const onMouseUp = () => setIsDragging(false);

  // Parse AI Insight for Structured Display
  const parsedInsight = useMemo(() => {
    if (!zoneInsight) return null;
    const risksPart = zoneInsight.match(/RISKS:(.*?)(?=ACTIONS:|$)/s);
    const actionsPart = zoneInsight.match(/ACTIONS:(.*)/s);
    return {
      risks: risksPart ? risksPart[1].trim() : zoneInsight,
      actions: actionsPart ? actionsPart[1].trim() : null
    };
  }, [zoneInsight]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-fadeIn">
      {/* Live Video Feeds */}
      <div className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className={`relative bg-black rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer group ${selectedFeed === feed.id ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-transparent hover:border-gray-600'}`}
              onClick={() => setSelectedFeed(feed.id)}
            >
              <img
                src={feed.image}
                alt={feed.name}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-2 border border-white/10">
                <span className={`w-2 h-2 rounded-full animate-pulse ${feed.status === 'Alert' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-emerald-500 shadow-lg shadow-emerald-500/50'}`}></span>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{feed.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Feed Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <i className="fa-solid fa-camera-rotate"></i>
            </button>
            <button className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <i className="fa-solid fa-magnifying-glass-plus"></i>
            </button>
            <button className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <i className="fa-solid fa-microphone-lines"></i>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm flex items-center">
              <i className="fa-solid fa-record-vinyl mr-2 animate-pulse"></i> Record
            </button>
          </div>
        </div>

        {/* Environmental Sensors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Temp', val: '24°C', icon: 'fa-temperature-half', color: 'text-orange-500' },
            { label: 'Air', val: 'Good', icon: 'fa-wind', color: 'text-emerald-500' },
            { label: 'Noise', val: '68dB', icon: 'fa-ear-listen', color: 'text-blue-500' },
            { label: 'CO2', val: '412ppm', icon: 'fa-gauge-high', color: 'text-slate-500' }
          ].map((s, i) => (
            <div key={i} className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-2xl border border-slate-300/50 shadow-sm flex flex-col items-center justify-center hover:shadow-md hover:scale-105 transition-all duration-300 group">
              <i className={`fa-solid ${s.icon} ${s.color} mb-2 text-lg drop-shadow-sm`}></i>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</span>
              <span className="text-sm font-bold text-slate-800">{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Map & Details Sidepanel */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        {/* Station Map */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-md font-bold text-slate-800">Station Layout & Zones</h2>
              <p className="text-[11px] text-slate-500">Live Alert Visualization</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mr-2">
                <button onClick={handleZoomOut} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded transition-colors">
                  <i className="fa-solid fa-minus text-xs"></i>
                </button>
                <button onClick={handleReset} className="px-2 text-[9px] font-black text-slate-600 hover:bg-white rounded transition-colors uppercase">
                  Reset
                </button>
                <button onClick={handleZoomIn} className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded transition-colors">
                  <i className="fa-solid fa-plus text-xs"></i>
                </button>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${showHistory ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
                title="Toggle Historical Markers"
              >
                <i className="fa-solid fa-clock-rotate-left text-xs"></i>
              </button>
            </div>
          </div>

          <div
            className="relative bg-slate-100 p-4 aspect-[4/3] overflow-hidden cursor-crosshair"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <div
              ref={mapRef}
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transformOrigin: 'center',
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="w-full h-full bg-white rounded-xl border border-gray-200 relative overflow-hidden shadow-inner select-none pointer-events-auto"
            >
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {/* INTERACTIVE ZONES WITH HIGHLIGHTING */}
              <div
                onClick={(e) => { e.stopPropagation(); setSelectedZoneId('waiting'); }}
                className={`absolute top-10 left-10 w-24 h-40 border-2 rounded p-2 transition-all cursor-pointer flex flex-col justify-center items-center text-center group ${selectedZoneId === 'waiting' ? 'bg-blue-600 border-blue-400 text-white shadow-lg scale-105 z-20' :
                  mapAlerts.find(a => a.zone === 'waiting' && a.severity === 'Warning') ? 'bg-orange-50 border-orange-200 text-orange-400 animate-pulse' :
                    'bg-blue-50/50 border-blue-100 text-blue-400 hover:bg-blue-100'
                  }`}
              >
                <i className="fa-solid fa-couch mb-1"></i>
                <span className="text-[8px] font-black uppercase">Waiting</span>
              </div>

              <div
                onClick={(e) => { e.stopPropagation(); setSelectedZoneId('ticketing'); }}
                className={`absolute top-10 right-10 w-40 h-24 border-2 rounded p-2 transition-all cursor-pointer flex flex-col justify-center items-center text-center group ${selectedZoneId === 'ticketing' ? 'bg-blue-600 border-blue-400 text-white shadow-lg scale-105 z-20' : 'bg-slate-50/50 border-slate-100 text-slate-400'
                  }`}
              >
                <i className="fa-solid fa-ticket mb-1"></i>
                <span className="text-[8px] font-black uppercase">Ticketing</span>
              </div>

              <div
                onClick={(e) => { e.stopPropagation(); setSelectedZoneId('entrance'); }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 rounded-full p-2 transition-all cursor-pointer flex flex-col justify-center items-center text-center group ${selectedZoneId === 'entrance' ? 'bg-blue-600 border-blue-400 text-white shadow-lg scale-105 z-20' :
                  mapAlerts.find(a => a.zone === 'entrance') ? 'bg-blue-50 border-blue-200 text-blue-400' :
                    'bg-slate-50/50 border-slate-100 text-slate-400'
                  }`}
              >
                <i className="fa-solid fa-door-open mb-1"></i>
                <span className="text-[8px] font-black uppercase">Entrance</span>
              </div>

              <div
                onClick={(e) => { e.stopPropagation(); setSelectedZoneId('platform'); }}
                className={`absolute bottom-10 left-10 w-[80%] h-12 border-2 rounded p-2 transition-all cursor-pointer flex flex-col justify-center items-center text-center group ${selectedZoneId === 'platform' ? 'bg-red-600 border-red-400 text-white shadow-lg scale-105 z-20' :
                  mapAlerts.find(a => a.zone === 'platform' && a.severity === 'Critical') ? 'bg-red-50 border-red-400 text-red-500 animate-pulse' :
                    'bg-slate-50/50 border-slate-100 text-slate-400'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-train-subway"></i>
                  <span className="text-[8px] font-black uppercase tracking-widest">Platform 4</span>
                </div>
              </div>

              {/* HISTORICAL MARKERS */}
              {showHistory && (selectedZoneId ? zoneHistory : filteredHistory).map((h) => (
                <div
                  key={h.id}
                  style={{ top: h.coords.top, left: h.coords.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                >
                  <div className="w-5 h-5 bg-slate-800/80 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md cursor-help hover:scale-125 transition-transform">
                    <i className="fa-solid fa-clock-rotate-left text-[8px]"></i>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white p-2 rounded text-[8px] font-bold w-24 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">
                    <p className="border-b border-white/20 pb-1 mb-1">{h.type}</p>
                    <p className="text-slate-400">{h.date}</p>
                  </div>
                </div>
              ))}

              {/* REAL-TIME ALERT HOTSPOTS WITH ICONS */}
              {mapAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={(e) => { e.stopPropagation(); setActiveAlertId(alert.id); setSelectedZoneId(alert.zone); }}
                  style={{ top: alert.coords.top, left: alert.coords.left, width: alert.coords.width, height: alert.coords.height }}
                  className={`absolute rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center group ${activeAlertId === alert.id ? 'border-2 border-red-500 bg-red-500/10 z-30' : 'bg-transparent'}`}
                >
                  {/* PULSATING ICON OVERLAY */}
                  <div className="relative flex items-center justify-center">
                    <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-25 ${alert.severity === 'Critical' ? 'bg-red-500' :
                      alert.severity === 'Warning' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}></div>
                    <div className={`w-8 h-8 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white ${alert.severity === 'Critical' ? 'bg-red-600' :
                      alert.severity === 'Warning' ? 'bg-orange-600' :
                        'bg-blue-600'
                      }`}>
                      <i className={`fa-solid ${alert.icon} text-[10px]`}></i>
                    </div>
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded whitespace-nowrap z-50">
                      {alert.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Zone Details & Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-md font-bold text-slate-800">
              {selectedZoneData ? `Zone Intel: ${selectedZoneData.name}` : 'Select a Zone for Intelligence'}
            </h2>
            {selectedZoneId && (
              <button
                onClick={fetchIntelligence}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center uppercase tracking-widest"
              >
                <i className={`fa-solid fa-arrows-rotate mr-1 ${isInsightLoading ? 'animate-spin' : ''}`}></i> Refresh AI
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {selectedZoneData ? (
              <>
                {/* AI Intelligence Card (Enhanced with Structured Parsing) */}
                <div className="bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl -mr-12 -mt-12"></div>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                      <i className="fa-solid fa-microchip text-blue-400 text-xs"></i>
                    </div>
                    <div>
                      <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Predictive Safety Intel</h4>
                      <p className="text-[9px] text-blue-400/70 font-bold uppercase">Real-time & Historical Hybrid Analysis</p>
                    </div>
                  </div>

                  {isInsightLoading ? (
                    <div className="flex flex-col space-y-3 py-4">
                      <div className="h-3 bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-slate-800 rounded-full w-1/2 animate-pulse"></div>
                      <div className="h-3 bg-slate-800 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      {parsedInsight ? (
                        <>
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <h5 className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2 flex items-center">
                              <i className="fa-solid fa-triangle-exclamation mr-1.5"></i> Detected Risk Factors
                            </h5>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {parsedInsight.risks}
                            </p>
                          </div>
                          {parsedInsight.actions && (
                            <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
                              <h5 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center">
                                <i className="fa-solid fa-bolt mr-1.5"></i> AI Recommended Actions
                              </h5>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                {parsedInsight.actions}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-[11px] text-slate-300 leading-relaxed italic">
                          Analyzing localized zone telemetry and historical safety records...
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Personnel on Site</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedZoneData.personnel.map(p => (
                        <span key={p} className="bg-white px-2 py-1 rounded text-[10px] font-bold text-slate-700 border border-slate-200 shadow-sm flex items-center">
                          <i className="fa-solid fa-user-shield text-[8px] mr-1.5 text-blue-500"></i> {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Historical Context</p>
                    <div className="mt-1">
                      <h4 className="text-sm font-black text-slate-700">{zoneHistory.length} Incidents <span className="text-[10px] text-slate-400 font-normal">({historyFilter}D)</span></h4>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Historical Recurring Issues</h4>
                    <div className="space-y-2">
                      {zoneHistory.length > 0 ? zoneHistory.map(h => (
                        <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-clock-rotate-left text-slate-500 text-xs"></i>
                          </div>
                          <div>
                            <div className="flex items-center justify-between w-full">
                              <p className="text-xs font-bold text-slate-800">{h.type}</p>
                              <p className="text-[9px] text-slate-400">{h.date}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">{h.description}</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-[10px] text-slate-400 italic">No historical data for this timeframe.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-100">
                    View Risk Assessment
                  </button>
                  <button className="flex-1 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800">
                    Trend Analysis
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <i className="fa-solid fa-map-location-dot text-4xl mb-4 opacity-20"></i>
                <h3 className="text-sm font-bold text-slate-600">No Zone Selected</h3>
                <p className="text-[10px] max-w-[200px] mt-2">Click station zones to view historical safety data and real-time personnel deployments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
