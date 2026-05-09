"use client";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function PsychChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi 👋 I'm here to help with psychology-related questions. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      if(data.reply.includes('Your details have been sent to Zainab.')){

        setMessages([...updated, { role: "assistant", content: data.reply }]);  
      } else {
        setMessages([...updated, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages([...updated, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: "24px", right: "24px",
          width: "60px", height: "60px", borderRadius: "50%",
          background: "lab(54.1736% 13.3369 -74.6839)", color: "white", fontSize: "28px",
          border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          zIndex: 9999,
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: "96px", right: "24px",
          width: "360px", height: "500px", borderRadius: "16px",
          background: "white", boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", zIndex: 9998,
          fontFamily: "sans-serif",
        }}>
          {/* Header */}
          <div style={{
            background: "lab(54.1736% 13.3369 -74.6839)", color: "white", padding: "16px",
            borderRadius: "16px 16px 0 0", fontWeight: "bold"
          }}>
            🧠 Psychology Assistant
            <div style={{ fontSize: "12px", fontWeight: "normal", opacity: 0.85 }}>
              Ask a question or book a session
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#f0f0f0" : "lab(77.5052% -6.4629 -36.42)",
                color: m.role === "user" ? "#333" : "#333",
                padding: "10px 14px", borderRadius: "12px",
                maxWidth: "85%", fontSize: "14px", lineHeight: "1.5", fontWeight: m.role === "assistant" ? "500" : "400",
              }}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", background: "#f0f0f0", padding: "10px 14px", borderRadius: "12px", fontSize: "14px", color: "#333", fontStyle: "italic" }}>
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px", borderTop: "1px solid #eee", display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your question..."
              style={{
                flex: 1, padding: "10px 12px", borderRadius: "8px",
                border: "1px solid #ddd", fontSize: "14px", outline: "none", color: "black"
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 16px", background: "lab(54.1736% 13.3369 -74.6839)", color: "white",
                border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}