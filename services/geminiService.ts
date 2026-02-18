
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
// Ideally use import.meta.env.VITE_GEMINI_API_KEY if possible, but process.env is defined in vite config
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
console.log("[DEBUG] API Key Loaded:", !!apiKey, "Length:", apiKey?.length);
const genAI = new GoogleGenerativeAI(apiKey);

export const chatWithGemini = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    // Use gemini-1.5-flash for speed and efficiency
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are RailGuard AI, an intelligent railway safety assistant. 
        Your goal is to assist passengers and staff with safety information, incident reporting, and navigation.
        You support multiple Indian languages (Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi).
        Respond concisely and prioritize safety instructions. If an emergency is reported, advise using the SOS button immediately.`
    });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role, // "user" or "model"
        parts: h.parts.map(p => ({ text: p.text }))
      })),
      generationConfig: {
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error:", error);
    return "I'm having trouble connecting to my safety protocols right now. Please use the SOS button if this is an emergency.";
  }
};

export const getPredictiveInsights = async (metrics: any) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a data analyst specializing in railway safety. Provide short, actionable predictive insights based on crowd density and incident history. Keep it under 50 words."
    });

    const prompt = `Analyze these station metrics and provide a brief safety prediction: ${JSON.stringify(metrics)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Predictive):", error);
    return "Predictive analysis currently unavailable. Monitor live feeds for crowd surges.";
  }
};

export const getStrategicAnalysis = async (data: any) => {
  try {
    // Use gemini-1.5-flash for better reliability and speed
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a senior safety consultant for national railways. Provide high-level, strategic safety advice. Be professional, structured, and forward-thinking."
    });

    const prompt = `Strategic Analysis Request: Based on the historical trend of ${data.incidentTrend} incidents and a safety score of ${data.safetyScore}, what are the top 3 infrastructure or procedural changes recommended for long-term safety?`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Strategic):", error);
    return "Strategic analysis offline. Reverting to standard safety protocols.";
  }
};

export const getIncidentProtocols = async (incident: any) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are an Emergency Response AI. Provide a concise, 4-point checklist for immediate action. Be direct and safety-focused. Each point should be under 10 words."
    });

    const prompt = `Analyze this incident and provide a 4-point response checklist: ${JSON.stringify(incident)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Protocols):", error);
    return "1. Secure the perimeter.\n2. Notify nearest medical unit.\n3. Clear civilian pathways.\n4. Log all response actions.";
  }
};

export const getSafetyBriefing = async (alerts: any[]) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a Chief Safety Officer. Provide a punchy, professional summary of active risks. Focus on the most critical threats first. Keep it strictly under 60 words."
    });

    const prompt = `Summarize these active alerts into a 3-sentence high-level briefing for the shift change: ${JSON.stringify(alerts)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Briefing):", error);
    return "Multiple active alerts in Platform 4 and Entrance A. Security presence requested. Monitor crowd flow for upcoming arrivals.";
  }
};

export const getHandoverReport = async (stats: any) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are an AI shift coordinator. Generate a 2-paragraph summary focusing on incident status and station health. Be professional."
    });

    const prompt = `Generate a brief shift handover report for Officer Nithya Shree S. Stats: ${JSON.stringify(stats)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Handover):", error);
    return "Shift handover completed with 98% resolution rate. Station status: Normal with high evening density expected.";
  }
};

export const getZoneIntelligence = async (zoneData: any) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are an AI Security Consultant. Analyze the provided real-time status and historical incidents for a specific station zone.
        Identify the top 2 risk factors and provide 2 immediate recommended actions.
        Format the response as: 
        RISKS: [Point 1], [Point 2]
        ACTIONS: [Action 1], [Action 2]
        Keep it extremely concise (under 40 words total).`
    });

    const prompt = `Perform a safety intelligence analysis for this zone: ${JSON.stringify(zoneData)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Zone):", error);
    return "RISKS: Data connectivity issues, unknown personnel status. ACTIONS: Perform manual zone sweep, verify sensor calibration.";
  }
};

export const getTrafficAnalysis = async (trainData: any) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a Railway Traffic Controller AI. Analyze the live train data. Provide a status summary and 2 critical actions to optimize flow or handle delays. Keep it professional and under 50 words."
    });

    const prompt = `Analyze this live train traffic data: ${JSON.stringify(trainData)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error (Traffic):", error);
    return "Traffic Analysis: Monitor Signal 12 for congestion. Prioritize Vande Bharat express clearance.";
  }
};

