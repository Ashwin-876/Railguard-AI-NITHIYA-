
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getTrafficAnalysis } from '../services/geminiService';

interface Train {
    id: string;
    name: string;
    status: 'On Time' | 'Delayed' | 'Maintenance';
    speed: string;
    nextStation: string;
    eta: string;
    coordinates: { x: number; y: number };
    route: { x: number; y: number }[];
    currentPointIndex: number;
}

// Define permanent routes for the demo
const RAJDHANI_ROUTE = [{ x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 50 }, { x: 80, y: 80 }, { x: 90, y: 90 }];
const VANDE_BHARAT_ROUTE = [{ x: 10, y: 80 }, { x: 30, y: 70 }, { x: 60, y: 25 }, { x: 90, y: 15 }];
const SHATABDI_ROUTE = [{ x: 50, y: 10 }, { x: 50, y: 40 }, { x: 45, y: 70 }, { x: 40, y: 90 }];
const FREIGHT_ROUTE = [{ x: 90, y: 60 }, { x: 80, y: 60 }, { x: 60, y: 60 }, { x: 20, y: 90 }];

interface LiveMapProps {
    currentStation?: string;
}

const LiveMap: React.FC<LiveMapProps> = ({ currentStation = "New Delhi Central" }) => {
    const [activeTrains, setActiveTrains] = useState<Train[]>([]);
    const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const analysisInterval = useRef<NodeJS.Timeout | null>(null);

    // Zoom and Pan State
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const mapRef = useRef<HTMLDivElement>(null);

    // Initialize Mock Data with Routes
    useEffect(() => {
        const initialTrains: Train[] = [
            {
                id: 'TR-1082', name: 'Rajdhani Express', status: 'On Time', speed: '110 km/h', nextStation: 'Kanpur Central', eta: '14:30',
                coordinates: RAJDHANI_ROUTE[0], route: RAJDHANI_ROUTE, currentPointIndex: 0
            },
            {
                id: 'TR-4021', name: 'Vande Bharat', status: 'Delayed', speed: '20 km/h', nextStation: 'Signal Wait', eta: '12:45',
                coordinates: VANDE_BHARAT_ROUTE[0], route: VANDE_BHARAT_ROUTE, currentPointIndex: 0
            },
            {
                id: 'TR-3390', name: 'Shatabdi Line', status: 'On Time', speed: '95 km/h', nextStation: 'Agra Cantt', eta: '13:15',
                coordinates: SHATABDI_ROUTE[0], route: SHATABDI_ROUTE, currentPointIndex: 0
            },
            {
                id: 'TR-8821', name: 'Freight Cor-A', status: 'Maintenance', speed: '0 km/h', nextStation: 'Yard B', eta: 'N/A',
                coordinates: FREIGHT_ROUTE[0], route: FREIGHT_ROUTE, currentPointIndex: 0
            },
        ];
        setActiveTrains(initialTrains);
    }, []);

    // Simulate Live Movement along Routes
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTrains(prevTrains => prevTrains.map(train => {
                if (train.status === 'Maintenance') return train;

                // Get current target
                const target = train.route[train.currentPointIndex + 1] || train.route[0];
                const current = train.coordinates;

                // Calculate distance and direction
                const dx = target.x - current.x;
                const dy = target.y - current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Move towards target
                const speedFactor = train.status === 'Delayed' ? 0.2 : 1.0; // Slower if delayed
                const step = 0.5 * speedFactor;

                if (distance < step) {
                    // Reached waypoint, move to next
                    const nextIndex = train.currentPointIndex + 1;
                    if (nextIndex >= train.route.length - 1) {
                        return { ...train, currentPointIndex: 0, coordinates: train.route[0] }; // Reset to start
                    }
                    return { ...train, currentPointIndex: nextIndex, coordinates: target };
                } else {
                    // Move a step closer
                    const ratio = step / distance;
                    return {
                        ...train,
                        coordinates: {
                            x: current.x + dx * ratio,
                            y: current.y + dy * ratio
                        }
                    };
                }
            }));
        }, 100); // Faster updates for smoother animation

        return () => clearInterval(interval);
    }, []);

    // AI Analysis Handler
    const handleAnalyzeTraffic = async () => {
        setIsAnalyzing(true);
        const insight = await getTrafficAnalysis(activeTrains);
        setAiInsight(insight);
        setIsAnalyzing(false);
    };

    // Zoom Handlers
    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
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

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Top Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Active Trains</p>
                        <h3 className="text-2xl font-bold text-slate-800">14</h3>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <i className="fa-solid fa-train"></i>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">On Schedule</p>
                        <h3 className="text-2xl font-bold text-emerald-600">11</h3>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                        <i className="fa-solid fa-clock"></i>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Delays</p>
                        <h3 className="text-2xl font-bold text-amber-500">3</h3>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Alerts</p>
                        <h3 className="text-2xl font-bold text-red-500">1</h3>
                    </div>
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                        <i className="fa-solid fa-bell"></i>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Map Area */}
                <div className="flex-1 bg-slate-900 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden group">
                    <div
                        className="w-full h-full relative cursor-crosshair overflow-hidden"
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
                            className="w-full h-full relative"
                        >
                            {/* Map Background */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559296181-e645910fa72c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30">
                                {/* Overlay for better text visibility */}
                                <div className="w-full h-full bg-slate-900/40"></div>
                            </div>

                            {/* Grid lines for tech feel */}
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                                backgroundSize: '40px 40px'
                            }}></div>

                            {/* Render Routes */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                {activeTrains.map((train, idx) => (
                                    <polyline
                                        key={`route-${train.id}`}
                                        points={train.route.map(p => `${p.x} ${p.y}`).join(', ')} // Points are already in % but this maps to viewBox if using %
                                    // However, simple polyline points in SVG don't take %, they take absolute. 
                                    // Alternatively, we can use absolute positioning divs for lines or map percentage to 100x100 coord system within SVG
                                    />
                                ))}
                                {/* Using vector-effect to keep stroke width constant */}
                                {activeTrains.map(train => (
                                    <path
                                        key={`path-${train.id}`}
                                        d={`M ${train.route.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                                        fill="none"
                                        stroke={train.status === 'On Time' ? '#10b981' : train.status === 'Delayed' ? '#f59e0b' : '#64748b'}
                                        strokeWidth="0.5"
                                        strokeDasharray="2 2"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                ))}
                            </svg>

                            {/* SVG Container for scalable coordinates 0-100 */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {activeTrains.map(train => (
                                    <path
                                        key={`path-${train.id}`}
                                        d={`M ${train.route.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                                        fill="none"
                                        stroke={train.status === 'On Time' ? '#3b82f6' : train.status === 'Delayed' ? '#f59e0b' : '#64748b'}
                                        strokeWidth="0.5"
                                        strokeDasharray="2 2"
                                        className="opacity-50"
                                    />
                                ))}
                            </svg>

                            {/* Render Trains on Map */}
                            {activeTrains.map((train) => (
                                <div
                                    key={train.id}
                                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110"
                                    style={{ left: `${train.coordinates.x}%`, top: `${train.coordinates.y}%` }}
                                    onClick={() => setSelectedTrain(train)}
                                >
                                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 ${selectedTrain?.id === train.id ? 'bg-blue-600 border-white z-10 scale-125' : 'bg-slate-800 border-blue-500'}`}>
                                        <i className="fa-solid fa-train text-white text-xs"></i>
                                        {selectedTrain?.id === train.id && (
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                                {train.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-slate-700 shadow-xl">
                        <div className="flex items-center space-x-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="font-semibold text-sm">Live Monitoring: {currentStation} Sector</span>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 flex space-x-2">
                        <button onClick={handleZoomIn} className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 border border-slate-600">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <button onClick={handleZoomOut} className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 border border-slate-600">
                            <i className="fa-solid fa-minus"></i>
                        </button>
                        <button onClick={handleReset} className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 border border-slate-600">
                            <i className="fa-solid fa-location-crosshairs"></i>
                        </button>
                    </div>

                </div>

                <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-700">Live Status</h3>
                            <p className="text-xs text-slate-500">Real-time train tracking</p>
                        </div>
                        <button
                            onClick={handleAnalyzeTraffic}
                            disabled={isAnalyzing}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition-all disabled:opacity-50"
                            title="Analyze Traffic with AI"
                        >
                            <i className={`fa-solid fa-wand-magic-sparkles ${isAnalyzing ? 'animate-spin' : ''}`}></i>
                        </button>
                    </div>

                    {aiInsight && (
                        <div className="p-3 bg-blue-50 border-b border-blue-100 animate-fadeIn">
                            <div className="flex items-start space-x-2">
                                <i className="fa-solid fa-robot text-blue-500 mt-1"></i>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-blue-400">AI Traffic Controller</p>
                                    <p className="text-xs text-slate-700 mt-1 leading-snug">{aiInsight}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto">
                        {activeTrains.map((train) => (
                            <div
                                key={train.id}
                                onClick={() => setSelectedTrain(train)}
                                className={`p-4 border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors ${selectedTrain?.id === train.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-800 text-sm">{train.name}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${train.status === 'On Time' ? 'bg-emerald-100 text-emerald-700' :
                                        train.status === 'Delayed' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                        }`}>{train.status}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                                    <span><i className="fa-solid fa-location-dot mr-1"></i> {train.nextStation}</span>
                                    <span><i className="fa-solid fa-gauge-high mr-1"></i> {train.speed}</span>
                                </div>
                                <div className="mt-2 text-xs text-slate-400">
                                    ETA: <span className="font-mono text-slate-600">{train.eta}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <button className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors shadow-lg">
                            Adjust Schedules
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveMap;
