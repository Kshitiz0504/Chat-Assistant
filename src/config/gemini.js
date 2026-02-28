import { GoogleGenerativeAI } from "@google/generative-ai";

if (!import.meta.env.VITE_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const apiKey = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function runChat(prompt) {
  try {
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: {
        thinkingConfig: {
          includeThoughts: false 
        }
      }
    });

    const result = await model.generateContent(prompt);
    
    const response = result.response;
    const text = response.text();
    
    console.log(text);
    return text;
    
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error; // Better to re-throw so the UI knows it failed
  }
}

export default runChat;