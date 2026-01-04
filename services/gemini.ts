
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Language, QuizQuestion, StudyNote } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateStudyNotes(grade: string, subject: string, unit: string, lang: Language): Promise<StudyNote> {
  const ai = getAIClient();
  const langName = lang === 'si' ? 'Sinhala' : lang === 'ta' ? 'Tamil' : 'English';
  
  const prompt = `Generate comprehensive, syllabus-aligned short notes for Sri Lankan ${grade} ${subject}, Unit: ${unit}. 
  Provide the output in ${langName}. 
  Include a title, the main content (formatted with clear sections), and a list of 5 key summary points.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          summary: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "content", "summary"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateQuiz(grade: string, subject: string, unit: string, lang: Language): Promise<QuizQuestion[]> {
  const ai = getAIClient();
  const langName = lang === 'si' ? 'Sinhala' : lang === 'ta' ? 'Tamil' : 'English';

  const prompt = `Generate 10 multiple-choice questions for Sri Lankan ${grade} ${subject}, Unit: ${unit}. 
  The questions and options must be in ${langName}. 
  Each question must have exactly 4 options and one correct answer index (0-3).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER }
          },
          required: ["question", "options", "correctAnswer"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}

// Utility for TTS audio decoding
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

export async function speakText(text: string) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Explain this briefly and clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return;

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioCtx);
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();
}
