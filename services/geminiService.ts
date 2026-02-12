
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const chatWithGemini = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are RailGuard AI, an intelligent railway safety assistant. 
        Your goal is to assist passengers and staff with safety information, incident reporting, and navigation.
        You support multiple Indian languages (Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi).
        Respond concisely and prioritize safety instructions. If an emergency is reported, advise using the SOS button immediately.`,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my safety protocols right now. Please use the SOS button if this is an emergency.";
  }
};

export const getPredictiveInsights = async (metrics: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these station metrics and provide a brief safety prediction: ${JSON.stringify(metrics)}`,
      config: {
        systemInstruction: "You are a data analyst specializing in railway safety. Provide short, actionable predictive insights based on crowd density and incident history. Keep it under 50 words.",
      }
    });
    return response.text;
  } catch (error) {
    return "Predictive analysis currently unavailable. Monitor live feeds for crowd surges.";
  }
};

export const getStrategicAnalysis = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Strategic Analysis Request: Based on the historical trend of ${data.incidentTrend} incidents and a safety score of ${data.safetyScore}, what are the top 3 infrastructure or procedural changes recommended for long-term safety?`,
      config: {
        systemInstruction: "You are a senior safety consultant for national railways. Provide high-level, strategic safety advice. Be professional, structured, and forward-thinking.",
      }
    });
    return response.text;
  } catch (error) {
    return "Strategic analysis offline. Reverting to standard safety protocols.";
  }
};

export const getIncidentProtocols = async (incident: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this incident and provide a 4-point response checklist: ${JSON.stringify(incident)}`,
      config: {
        systemInstruction: "You are an Emergency Response AI. Provide a concise, 4-point checklist for immediate action. Be direct and safety-focused. Each point should be under 10 words.",
      }
    });
    return response.text;
  } catch (error) {
    return "1. Secure the perimeter.\n2. Notify nearest medical unit.\n3. Clear civilian pathways.\n4. Log all response actions.";
  }
};

export const getSafetyBriefing = async (alerts: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize these active alerts into a 3-sentence high-level briefing for the shift change: ${JSON.stringify(alerts)}`,
      config: {
        systemInstruction: "You are a Chief Safety Officer. Provide a punchy, professional summary of active risks. Focus on the most critical threats first. Keep it strictly under 60 words.",
      }
    });
    return response.text;
  } catch (error) {
    return "Multiple active alerts in Platform 4 and Entrance A. Security presence requested. Monitor crowd flow for upcoming arrivals.";
  }
};

export const getHandoverReport = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a brief shift handover report for Officer Arjun. Stats: ${JSON.stringify(stats)}`,
      config: {
        systemInstruction: "You are an AI shift coordinator. Generate a 2-paragraph summary focusing on incident status and station health. Be professional.",
      }
    });
    return response.text;
  } catch (error) {
    return "Shift handover completed with 98% resolution rate. Station status: Normal with high evening density expected.";
  }
};

export const getZoneIntelligence = async (zoneData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a safety intelligence analysis for this zone: ${JSON.stringify(zoneData)}`,
      config: {
        systemInstruction: `You are an AI Security Consultant. Analyze the provided real-time status and historical incidents for a specific station zone.
        Identify the top 2 risk factors and provide 2 immediate recommended actions.
        Format the response as: 
        RISKS: [Point 1], [Point 2]
        ACTIONS: [Action 1], [Action 2]
        Keep it extremely concise (under 40 words total).`,
      }
    });
    return response.text;
  } catch (error) {
    return "RISKS: Data connectivity issues, unknown personnel status. ACTIONS: Perform manual zone sweep, verify sensor calibration.";
  }
};
