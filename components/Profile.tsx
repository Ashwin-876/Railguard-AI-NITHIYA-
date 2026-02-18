
import React, { useState, useEffect } from 'react';
import { getHandoverReport } from '../services/geminiService';

const Profile: React.FC = () => {
  const [isHandoverLoading, setIsHandoverLoading] = useState(false);
  const [handoverSummary, setHandoverSummary] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [officerData, setOfficerData] = useState({
    name: 'Nithya Shree S',
    badgeId: 'ND-7712',
    designation: 'Senior Safety Lead',
    station: 'Coimbatore Junction',
    joiningDate: 'May 2019',
    status: 'On Duty',
    email: 'nithya.shree@railways.gov.in',
    phone: '+91 98765-XXXXX',
    compliance: 94,
    incidentsResolved: 1284,
    responseVelocity: 'Top 5%',
    safetyRating: '4.9/5.0'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOfficerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const certifications = [
    { name: 'Advanced Emergency Protocols', expiry: 'Jan 2026', status: 'Active' },
    { name: 'RailGuard AI Master Certification', expiry: 'Dec 2025', status: 'Active' },
    { name: 'First Aid & Trauma Support', expiry: 'Feb 2025', status: 'Renew Soon' },
    { name: 'Crowd Dynamics Level 3', expiry: 'Aug 2026', status: 'Active' }
  ];

  const handleGenerateHandover = async () => {
    setIsHandoverLoading(true);
    const report = await getHandoverReport({
      incidents: 12,
      safetyScore: 92,
      resolved: '98%'
    });
    setHandoverSummary(report || "Handover summary generation failed. Reverting to manual entry.");
    setIsHandoverLoading(false);
  };

  const [notificationSettings, setNotificationSettings] = useState([
    { label: 'Critical Safety Alerts', checked: true },
    { label: 'AI Crowd Surge Predictions', checked: true },
    { label: 'Platform Environmental Logs', checked: false },
    { label: 'System Diagnostic Briefs', checked: false }
  ]);

  const toggleNotification = (index: number) => {
    setNotificationSettings(prev =>
      prev.map((setting, i) => i === index ? { ...setting, checked: !setting.checked } : setting)
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative">
          <img
            src="https://picsum.photos/seed/nithya/200/200"
            alt="Nithya Shree S"
            className="w-40 h-40 rounded-3xl object-cover shadow-lg border-4 border-white ring-1 ring-slate-100"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white shadow-md flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={officerData.name}
                  onChange={handleInputChange}
                  className="text-3xl font-black text-slate-900 tracking-tight border-b-2 border-blue-500 focus:outline-none w-full"
                />
              ) : (
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{officerData.name}</h2>
              )}

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-1">
                {isEditing ? (
                  <input
                    type="text"
                    name="designation"
                    value={officerData.designation}
                    onChange={handleInputChange}
                    className="text-blue-600 text-xs font-bold uppercase tracking-widest border-b border-blue-300 focus:outline-none"
                  />
                ) : (
                  <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">{officerData.designation}</span>
                )}

                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                {isEditing ? (
                  <div className="flex items-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mr-1">Badge ID:</span>
                    <input
                      type="text"
                      name="badgeId"
                      value={officerData.badgeId}
                      onChange={handleInputChange}
                      className="text-slate-500 text-xs font-bold uppercase tracking-widest w-20 border-b border-blue-300 focus:outline-none"
                    />
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Badge ID: {officerData.badgeId}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${isEditing ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-100'}`}
            >
              {isEditing ? 'Save Changes' : 'Edit Professional Profile'}
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Response Velocity</p>
              {isEditing ? (
                <input
                  type="text"
                  name="responseVelocity"
                  value={officerData.responseVelocity}
                  onChange={handleInputChange}
                  className="text-lg font-black text-slate-900 w-full bg-transparent border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <h4 className="text-lg font-black text-slate-900">{officerData.responseVelocity}</h4>
              )}
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Incidents Resolved</p>
              {isEditing ? (
                <input
                  type="number"
                  name="incidentsResolved"
                  value={officerData.incidentsResolved}
                  onChange={handleInputChange}
                  className="text-lg font-black text-slate-900 w-full bg-transparent border-b border-gray-300 focus:outline-none"
                />
              ) : (
                <h4 className="text-lg font-black text-slate-900">{officerData.incidentsResolved}</h4>
              )}
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Safety Rating</p>
              {isEditing ? (
                <div className="flex items-center space-x-1">
                  <i className="fa-solid fa-star text-orange-400 text-sm"></i>
                  <input
                    type="text"
                    name="safetyRating"
                    value={officerData.safetyRating}
                    onChange={handleInputChange}
                    className="text-lg font-black text-slate-900 w-20 bg-transparent border-b border-gray-300 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <i className="fa-solid fa-star text-orange-400 text-sm"></i>
                  <h4 className="text-lg font-black text-slate-900">{officerData.safetyRating}</h4>
                </div>
              )}
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shift Loyalty</p>
              {isEditing ? (
                <div className="flex items-center">
                  <input
                    type="number"
                    name="compliance"
                    value={officerData.compliance}
                    onChange={handleInputChange}
                    className="text-lg font-black text-slate-900 w-16 bg-transparent border-b border-gray-300 focus:outline-none"
                  />
                  <span className="text-lg font-black text-slate-900 ml-1">%</span>
                </div>
              ) : (
                <h4 className="text-lg font-black text-slate-900">{officerData.compliance}%</h4>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact & Professional Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Professional Identity</h3>
              <i className="fa-solid fa-id-card text-slate-300"></i>
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Work Email</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="email"
                    value={officerData.email}
                    onChange={handleInputChange}
                    className="text-sm font-semibold text-slate-700 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{officerData.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Duty Contact</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={officerData.phone}
                    onChange={handleInputChange}
                    className="text-sm font-semibold text-slate-700 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{officerData.phone}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Primary Station</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="station"
                    value={officerData.station}
                    onChange={handleInputChange}
                    className="text-sm font-semibold text-slate-700 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{officerData.station}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enlistment Date</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="joiningDate"
                    value={officerData.joiningDate}
                    onChange={handleInputChange}
                    className="text-sm font-semibold text-slate-700 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">{officerData.joiningDate}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Safety Certifications</h3>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100">
                Fully Compliant
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {certifications.map((cert, idx) => (
                <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cert.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      <i className={`fa-solid ${cert.status === 'Active' ? 'fa-award' : 'fa-hourglass-half'}`}></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{cert.name}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Valid until: {cert.expiry}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${cert.status === 'Active' ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Handover & Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-handshake-angle text-white"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold leading-tight">Shift Handover</h3>
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">End of Watch Prep</p>
                </div>
              </div>

              {handoverSummary ? (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
                  <p className="text-slate-300 text-xs leading-relaxed italic">
                    "{handoverSummary}"
                  </p>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8 flex flex-col items-center justify-center text-center mb-6">
                  <i className="fa-solid fa-microchip text-slate-600 text-2xl mb-3"></i>
                  <p className="text-[11px] text-slate-500 font-medium">Ready to synthesize your shift performance and active safety risks for the next lead.</p>
                </div>
              )}

              <button
                onClick={handleGenerateHandover}
                disabled={isHandoverLoading}
                className={`w-full py-4 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-[0.1em] hover:bg-blue-50 transition-all flex items-center justify-center ${isHandoverLoading ? 'opacity-50 cursor-wait' : ''}`}
              >
                {isHandoverLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Processing Safety Data
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-bolt-lightning mr-2 text-blue-600"></i> Generate AI Handover
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h4 className="font-bold text-slate-800 mb-6 flex items-center">
              <i className="fa-solid fa-sliders text-blue-600 mr-2"></i> Notification Controls
            </h4>
            <div className="space-y-4">
              {notificationSettings.map((setting, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleNotification(idx)}
                >
                  <span className="text-xs font-medium text-slate-600">{setting.label}</span>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${setting.checked ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${setting.checked ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button className="w-full py-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors">
                Revoke Station Access Tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Profile;
