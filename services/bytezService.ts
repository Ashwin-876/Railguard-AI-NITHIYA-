const key = "d6b0645bd30629b23515e48286ccd15e";
let sdk: any = null;
let model: any = null;

const getModel = async () => {
    if (!model) {
        try {
            // @ts-ignore
            const module = await import("bytez.js");
            const Bytez = module.default || module;

            if (!Bytez) {
                throw new Error("Bytez library failed to load.");
            }

            sdk = new (Bytez as any)(key);
            // Switched to Llama-3-8B for faster inference speed
            model = sdk.model("meta-llama/Meta-Llama-3-8B-Instruct");
            console.log("Bytez SDK initialized dynamically");
        } catch (e) {
            console.error("Failed to load Bytez SDK:", e);
            throw e;
        }
    }
    return model;
};

interface ChatHistoryItem {
    role: 'user' | 'model';
    text: string;
}

export const chatWithBytez = async (message: string, history: ChatHistoryItem[]) => {
    try {
        const modelInstance = await getModel();

        // Transform history to Bytez format (User/Assistant)
        // Bytez likely expects 'user' and 'assistant' roles for chat models
        const formattedHistory = history.map(h => ({
            role: h.role === 'model' ? 'assistant' : 'user',
            content: h.text
        }));

        // Construct the input array with the new message
        const input = [
            ...formattedHistory,
            {
                role: "user",
                content: message
            }
        ];

        console.log("Sending to Bytez:", JSON.stringify(input, null, 2));

        const { error, output } = await modelInstance.run(input);

        if (error) {
            console.error("Bytez API Error:", error);
            return "I'm having trouble connecting to the chat service. Please try again.";
        }

        console.log("Bytez response:", output);

        // Handle string output
        if (typeof output === 'string') {
            return output;
        }
        // Handle object output with text/content
        if (output && typeof output === 'object') {
            if ('text' in output) return (output as any).text;
            if ('content' in output) return (output as any).content;
            if ('message' in output) return (output as any).message;
        }
        // Handle array output
        if (Array.isArray(output) && output.length > 0) {
            return output[0].text || output[0].content || JSON.stringify(output[0]);
        }

        return JSON.stringify(output);

    } catch (error) {
        console.error("Chat Service Exception:", error);
        return `Connection Error: ${error instanceof Error ? error.message : String(error)}`;
    }
};
export const getStrategicAnalysis = async (data: any) => {
    try {
        const modelInstance = await getModel();
        const prompt = `Strategic Analysis Request: Based on the historical trend of ${data.incidentTrend} incidents and a safety score of ${data.safetyScore}, what are the top 3 infrastructure or procedural changes recommended for long-term safety? Provide a professional, structured response.`;

        const input = [
            {
                role: "user",
                content: prompt
            }
        ];

        console.log("Sending Strategy Request to Bytez:", JSON.stringify(input, null, 2));
        const { error, output } = await modelInstance.run(input);

        if (error) {
            console.error("Bytez API Error (Strategy):", error);
            return "Strategic analysis temporarily unavailable.";
        }

        console.log("Bytez Strategy Response:", output);

        if (typeof output === 'string') return output;
        if (output && typeof output === 'object') {
            if ('text' in output) return (output as any).text;
            if ('content' in output) return (output as any).content;
        }
        if (Array.isArray(output) && output.length > 0) {
            return output[0].text || output[0].content || JSON.stringify(output[0]);
        }

        return JSON.stringify(output);
    } catch (error) {
        console.error("Strategy Service Exception:", error);
        return "Strategic analysis offline. Reverting to standard safety protocols.";
    }
};
export const getSafetyBriefing = async (alerts: any[]) => {
    try {
        const modelInstance = await getModel();
        const prompt = `Summarize these active alerts into a 3-sentence high-level briefing for the shift change, formatted as a direct quote from a Chief Safety Officer: ${JSON.stringify(alerts)}`;

        const input = [
            {
                role: "user",
                content: prompt
            }
        ];

        console.log("Sending Briefing Request to Bytez:", JSON.stringify(input, null, 2));
        const { error, output } = await modelInstance.run(input);

        if (error) {
            console.error("Bytez API Error (Briefing):", error);
            return "Unable to generate safety briefing at this time.";
        }

        console.log("Bytez Briefing Response:", output);

        if (typeof output === 'string') return output;
        if (output && typeof output === 'object') {
            if ('text' in output) return (output as any).text;
            if ('content' in output) return (output as any).content;
        }
        if (Array.isArray(output) && output.length > 0) {
            return output[0].text || output[0].content || JSON.stringify(output[0]);
        }

        return JSON.stringify(output);
    } catch (error) {
        console.error("Briefing Service Exception:", error);
        return "Multiple active alerts in Platform 4 and Entrance A. Security presence requested. Monitor crowd flow for upcoming arrivals.";
    }
};
