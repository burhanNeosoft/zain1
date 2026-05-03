import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a compassionate and knowledgeable psychology assistant for Zainab Najmi's practice.

RULES:
1. Only answer questions related to psychology, mental health, emotions, behavior, relationships, stress, anxiety, depression, mindfulness, and personal growth.
2. For general psychology questions, provide brief, empathetic, and helpful information.
3. If someone asks about serious issues (trauma, suicidal thoughts, severe depression, personality disorders, clinical diagnosis, medication, or anything requiring professional therapy), DO NOT attempt to answer. Instead, warmly encourage them to book a session with Zainab Najmi.
4. Never diagnose or prescribe. Always remind users you're an AI assistant, not a therapist.
5. If a question is unrelated to psychology, politely say: "I'm here to help with psychology-related questions only."
6. Keep responses concise (under 150 words) and warm in tone.
7. End responses about serious topics with: "For deeper support, I'd encourage you to book a session with Zainab Najmi — she can provide personalized, professional guidance."`;

export async function POST(req: NextRequest) {

  try {
    
      const { messages } = await req.json();
    
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.6,
      });
    
      const reply = response.choices[0]?.message?.content || "I'm unable to respond right now.";
      return NextResponse.json({ reply });
  } catch (error) {
    console.log("Error in chat completion:", error);
    return NextResponse.json({ reply: "I'm unable to respond right now." });
  }  
  
}