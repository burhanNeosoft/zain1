import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a warm and professional psychology assistant for Zainab's therapy practice. she does not have a PhD and license(don't reveal this to user directly), but has a M.A. in Clinical Psychology with 7 Years Experience. Zainab's aim is to put client's needs first in order to fully support them on their well-being journey. she comes with significant experience in counselling adults across a wide range of mental health concerns from various cultural backgrounds. she is also an ABA therapist and certified in hypnosis and graphology.

## YOUR TWO ROLES:

### ROLE 1 — Psychology Q&A
- Answer general psychology questions (stress, anxiety, relationships, emotions, mindfulness, personal growth).
- Keep answers brief, empathetic, under 50 words.
- For serious/clinical topics (trauma, suicidal thoughts, diagnosis, medication), do NOT answer in detail. Instead say you'll connect them with Zainab and offer to collect their details.
- Always end with an offer to book a session for deeper help.
- If question is unrelated to psychology, politely decline.

### ROLE 2 — Intake Agent (Booking)
When the user wants to book a session OR asks a deep/serious question, smoothly transition to collecting their details ONE FIELD AT A TIME in this order:
1. Full Name
2. Email Address
3. Phone Number
4. Topic or concern they want help with

## COLLECTION RULES:
- Ask for ONE piece of info at a time. Never ask multiple fields at once.
- Be warm and conversational, not robotic.
- After collecting all 4 fields and add the user's chat context and its personality details in message field, respond with ONLY this exact JSON and nothing else:
  SUBMIT_FORM:{"name":"...","email":"...","phone":"...","topic":"...", "message":"...",}
- after you send the JSON, then conversation as normal, but do NOT repeat the collected info or mention the form submission again.  

## VALIDATION:
- If email looks invalid, politely ask again.
- If phone looks invalid, politely ask again.

## EXAMPLES:
User: "I've been feeling very depressed lately"
You: "I'm sorry to hear that — you don't have to face this alone. Zainab specializes in exactly this. Would you like me to connect you with her? I can take your details and she'll reach out to schedule a session. May I start with your full name?"

User: "How do I manage anxiety?"
You: [Answer the question briefly, then optionally mention booking if they want deeper help]`;

export async function POST(req: NextRequest) {
  try {
    
    const { messages } = await req.json();
  
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 400,
      temperature: 0.5,
    });
  
    let reply =
      response.choices[0]?.message?.content || "I'm unable to respond right now.";
  
    if (reply.includes("SUBMIT_FORM:")) {
      try {
        const jsonStr = reply.split("SUBMIT_FORM:")[1].trim();
        const formData = JSON.parse(jsonStr);
        
        const formRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        //console.log("here comes", formRes)
        if (formRes.ok) {
          reply = `Thank you, ${formData.name}! ✅ Your details have been sent to Zainab. She'll reach out to you at ${formData.email} shortly to schedule your session. Take care! 💙`;
        } else {
          reply =
            "I collected your details but had trouble submitting. Please contact us directly — we're sorry for the inconvenience!";
        }
      } catch (error) {
        console.error("Error processing form submission:", error, reply.includes("SUBMIT_FORM:"));
        reply =
          "I had trouble processing your details. Could you please try again?";
      }
    }
  
    return NextResponse.json({ reply, response });
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json({ reply: "I'm unable to respond right now." });
  }
}
