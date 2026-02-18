# RailGuard AI 

## 📖 Introduction

**RailGuard AI** is an AI-Enabled Web Platform for Intelligent Railway Emergency Assistance, designed to enhance public safety and modernize railway operations.

This project represents a step towards smart city development, leveraging Artificial Intelligence to create safer and more efficient transportation hubs. In emergencies, every second counts—RailGuard AI bridges the gap between detection and action.

It provides a comprehensive suite of tools including:
*   **Real-time Monitoring:** Live surveillance and environmental tracking.
*   **Predictive Intelligence:** AI-driven forecasting of crowd surges and safety risks.
*   **Rapid Response:** Instant emergency broadcasting and digitized protocols.

By integrating these technologies, RailGuard AI ensures passenger safety and streamlines station management operations.

## 🌟 Key Features

### 1. **Live Monitoring Dashboard**
*   **Multi-Feed Surveillance:** View live feeds from key station zones (Entrance, Platforms, Ticketing, Corridors).
*   **Interactive Station Map:** Visual layout of the station with real-time zone status (Normal, Alert, Emergency).
*   **AI-Powered Zone Intel:** Click on any zone to receive instant, AI-generated safety analysis, risk factors, and recommended actions based on crowd density and historical data.

### 2. **Strategic Analytics**
*   **Predictive Crowd Heatmaps:** Toggle between real-time data and AI-generated predictive heatmaps to forecast crowd density.
*   **Safety Score Tracking:** Monitor the station's overall safety score in real-time.
*   **Incident Trends:** Visualize incident data over time to identify patterns.

### 3. **AI Lost & Found Scanner**
*   **Biometric & Object Scan:** Upload reference images to scan active camera feeds for missing persons or lost luggage using advanced computer vision.
*   **Global Scan:** Initiate simultaneous scans across multiple feeds with a single click.

### 4. **Emergency Response System**
*   **Real-time Alerts:** Receive and manage critical alerts (Crowd Surge, Security, Medical, Environmental).
*   **Emergency Broadcast:** Deploy instant "Red Alert" notifications to station screens and staff devices.
*   **Smart Filtering:** Filter alerts by severity (Critical, Warning, Advisory).

### 5. **Officer Profile & Handover**
*   **Digital Duty Log:** Track shift status, assigned zones, and resolve incidents.
*   **AI Shift Handover:** Generate comprehensive shift summary reports automatically.

## 🚀 Tech Stack

*   **Frontend:** React (TypeScript), Vite
*   **Styling:** Tailwind CSS (Modern, responsive design)
*   **AI Engine:** 
    *   **Google Gemini API** (`gemini-1.5-flash`) for general intelligence and reporting.
    *   **Bytez SDK** (`meta-llama/Meta-Llama-3-8B-Instruct`) for strategic analysis and edge inference.
*   **Visualization:** Recharts (Data analytics)
*   **Icons:** FontAwesome

## 🛠️ Installation & Setup

1.  **Clone and Run:**
    ```bash
    git clone https://github.com/
    
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    cd railway-gaurd
    npm run dev
    ```

3.  **Configure Environment:**
    *   Create a `.env.local` file in the root directory.
    *   Add your AI Service API keys:
        ```env
        GEMINI_API_KEY=your_gemini_api_key_here
        # VITE_BYTEZ_KEY=your_bytez_key_here (Optional: current build uses embedded key)
        ```

4.  **Run Locally:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:.

## 🔒 Security Note

*   **API Keys:** Ensure your API key is kept secret and never committed to public repositories. The `.env.local` file is included in `.gitignore` for this reason.

## 👩‍💻 About the Developer

I am **Nithya**, the developer of **RailGuard AI**. This project demonstrates my interest in Artificial Intelligence and smart safety systems. My goal is to build innovative solutions that improve public safety and contribute to smart city development.

---

*Built for the future of railway safety.*
