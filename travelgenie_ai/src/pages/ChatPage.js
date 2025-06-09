import React, { useState, useRef, useEffect } from "react";

// PUBLIC_INTERFACE
function ChatPage() {
  /**
   * AI travel chat powered by Cohere, using REACT_APP_COHERE_KEY.
   */
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm TravelGenie. Ask me anything about your trip or destination!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const COHERE_KEY = process.env.REACT_APP_COHERE_KEY;

  // Cohere Chat endpoint for Q&A context (requires account and endpoint enabled)
  async function callCohereChat(prompt, chatHistory) {
    const res = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_KEY}`,
        "Content-Type": "application/json",
        "Cohere-Version": "2022-12-06"
      },
      body: JSON.stringify({
        model: "command",
        message: prompt,
        chat_history: chatHistory.map(m => ({
          user_name: m.from === "user" ? "User" : "AI",
          message: m.text
        })),
        temperature: 0.8
      }),
    });
    if (!res.ok) throw new Error("Failed to get AI response. API error.");
    const data = await res.json();
    return data?.text || "No response.";
  }

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;
    setInput("");
    setError("");
    setLoading(true);
    const userMsg = { from: "user", text: question };
    setMessages(msgs => [...msgs, userMsg]);
    try {
      if (!COHERE_KEY) throw new Error("Cohere API key missing (REACT_APP_COHERE_KEY).");
      const chatHistory = [...messages, userMsg];
      const reply = await callCohereChat(question, chatHistory);
      setMessages(msgs => [...msgs, { from: "ai", text: reply }]);
    } catch (err) {
      setError(err.message || "Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom on new message
    if (inputRef.current) inputRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container" style={{maxWidth:600, marginTop:110}}>
      <h2 className="title" style={{fontSize: "2.2rem", marginBottom:18}}>AI Travel Chat</h2>
      <div style={{
        minHeight: 320, 
        background: "rgba(255,255,255,0.03)",
        borderRadius: 8,
        border: "1px solid var(--border-color)",
        padding: "18px 12px 12px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        overflowY: "auto"
      }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}
            style={{
              alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
              background: msg.from === "ai" 
                ? "rgba(103, 208, 134, 0.16)" 
                : "rgba(234,97,97,0.16)",
              borderRadius: "16px",
              padding: "10px 16px",
              maxWidth: "78%",
              color: msg.from === "ai" ? "#67d086" : "#ea6161"
            }}>
            {msg.text}
          </div>
        ))}
        <span ref={inputRef}/>
      </div>
      <form onSubmit={handleSend} style={{
        marginTop:14,
        display:"flex",
        gap:8
      }}>
        <input
          type="text"
          value={input}
          onChange={e=>setInput(e.target.value)}
          className="input"
          placeholder="Type your travel question..."
          disabled={loading}
          autoFocus
        />
        <button className="btn btn-large" type="submit" disabled={loading || !input.trim()}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
      {error &&
        <div style={{color:"tomato", marginTop:10, fontSize:".97rem"}}>{error}</div>
      }
      <div style={{marginTop:10, color:"var(--text-secondary)", fontSize:".96rem"}}>
        Try asking: <span style={{fontStyle:"italic"}}>What should I pack for Iceland? What to do in Paris?</span>
      </div>
    </div>
  );
}

export default ChatPage;
