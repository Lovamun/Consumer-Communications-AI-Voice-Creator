
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTTS = async (text: string, voiceName: string, mood: string = 'neutral') => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say this in a ${mood} tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName === 'Adam' ? 'Kore' : 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS generation failed:", error);
    return null;
  }
};

export const analyzeAudio = async (base64Data: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'audio/mp3', data: base64Data } },
        { text: "Analyze this voice clip. Provide details on speaker age, gender, accent, and clarity." }
      ]
    }
  });
  return response.text;
};

export const cleanAudio = async (base64Data: string) => {
  // In a real scenario, this would use a dedicated DSP or a cleaning model part of Gemini
  // Here we simulate the process
  console.log("Cleaning audio via Gemini simulation...");
  return base64Data; // Return as is for simulation
};

export const liveVoiceConnect = async (callbacks: any) => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are an AI voice conversion system. Repeat what the user says but in a refined studio voice.',
    }
  });
};
