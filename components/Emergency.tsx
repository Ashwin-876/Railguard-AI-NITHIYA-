
import React, { useState } from 'react';

const Emergency: React.FC = () => {
  const [sosActive, setSosActive] = useState(false);
  const [alertType, setAlertType] = useState('');

  const handleSos = () => {
    setSosActive(true);
    // Simulate real-time logic
    setTimeout(() => {
       alert("Emergency dispatch units have been notified for New Delhi Central, Platform 4.");
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* SOS Trigger Area */}
      <div className={`p-12 rounded-3xl transition-all duration-500 flex flex-col items-center justify-center text-center ${
        sosActive ? 'bg-red-600 text-white shadow-2xl shadow-red-300' : 'bg-white border-2 border-dashed border-red-200 shadow-sm'
      }`}>
        <div 
          onClick={handleSos}
          className={`w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 ${
            sosActive ? 'bg-white text-red-600' : 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-100'
          }`}
        >
          <div className="flex flex-col items-center">
            <i className="fa-solid fa-power-off text-3xl md:text-5xl mb-2"></i>
            <span className="font-black text-xl md:text-2xl">SOS</span>
          </div>
        </div>
        <h2 className={`text-2xl font-bold mt-8 ${sosActive ? 'text-white' : 'text-slate-800'}`}>
          {sosActive ? 'EMERGENCY DISPATCHED' : 'ONE-CLICK EMERGENCY SOS'}
        </h2>
        <p className={`mt-2 max-w-md ${sosActive ? 'text-red-100' : 'text-slate-500'}`}>
          {sosActive 
            ? 'Station master and emergency responders have been alerted. Stay in position.' 
            : 'Press the button above to immediately notify all station security and nearby emergency services.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rapid Response Team Status */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Response Units Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-truck-medical"></i>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900">Medical Unit A-1</h4>
                  <p className="text-xs text-emerald-700">Available • Standby P-4</p>
                </div>
              </div>
              <button className="text-emerald-700 font-bold text-xs uppercase hover:underline">Dispatch</button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-person-military-pointing"></i>
                </div>
                <div>
                  <h4 className="font-bold text-orange-900">Security Squad 04</h4>
                  <p className="text-xs text-orange-700">En route • North Hall</p>
                </div>
              </div>
              <span className="text-xs text-orange-600 font-bold italic animate-pulse">2m away</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-fire-extinguisher"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Fire Response B-2</h4>
                  <p className="text-xs text-slate-500">Occupied • Training</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contacts & Protocols */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-lg text-white">
          <h2 className="text-lg font-bold mb-6">Critical Contacts</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="tel:100" className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors flex flex-col items-center justify-center">
              <i className="fa-solid fa-phone-flip text-blue-400 mb-2"></i>
              <span className="text-xl font-bold">100</span>
              <span className="text-xs text-slate-400">Police</span>
            </a>
            <a href="tel:102" className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors flex flex-col items-center justify-center">
              <i className="fa-solid fa-phone-flip text-red-400 mb-2"></i>
              <span className="text-xl font-bold">102</span>
              <span className="text-xs text-slate-400">Ambulance</span>
            </a>
            <a href="tel:182" className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors flex flex-col items-center justify-center">
              <i className="fa-solid fa-phone-flip text-emerald-400 mb-2"></i>
              <span className="text-xl font-bold">182</span>
              <span className="text-xs text-slate-400">Railway Security</span>
            </a>
            <a href="tel:101" className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors flex flex-col items-center justify-center">
              <i className="fa-solid fa-phone-flip text-orange-400 mb-2"></i>
              <span className="text-xl font-bold">101</span>
              <span className="text-xs text-slate-400">Fire Brigade</span>
            </a>
          </div>
          <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="text-sm font-bold text-blue-400 mb-2 uppercase">Emergency Protocol</h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
              <li>Clear the immediate area and create a safety perimeter.</li>
              <li>Switch station intercoms to Emergency Broadcast mode.</li>
              <li>Initiate live tracking of nearest response unit.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
