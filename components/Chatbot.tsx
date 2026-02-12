
import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../services/geminiService';
import { Message } from '../types';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I am RailGuard AI. How can I assist you with safety or station information today? You can talk to me in Hindi, Bengali, Tamil, or any other Indian language.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await chatWithGemini(input, history);
    
    setMessages(prev => [...prev, { role: 'model', text: response || "Error generating response", timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
      <div className="bg-slate-900 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-robot text-white"></i>
          </div>
          <div>
            <h2 className="text-white font-bold">Multilingual Safety AI</h2>
            <p className="text-blue-400 text-xs">Available in 12 Indian Languages</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 shadow-sm border border-gray-100 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 rounded-tl-none flex items-center space-x-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your safety query in any language..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
              <i className="fa-solid fa-microphone"></i>
            </button>
          </div>
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4">
           <button className="text-[11px] text-slate-500 hover:text-blue-600 font-semibold" onClick={() => setInput("Nearest medical booth?")}>Medical Help</button>
           <button className="text-[11px] text-slate-500 hover:text-blue-600 font-semibold" onClick={() => setInput("How to report a bag?")}>Report Item</button>
           <button className="text-[11px] text-slate-500 hover:text-blue-600 font-semibold" onClick={() => setInput("Train schedule Hindi me?")}>Hindi Assist</button>
           <button className="text-[11px] text-red-600 hover:text-red-700 font-bold" onClick={() => setInput("EMERGENCY SOS")}>Emergency</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
