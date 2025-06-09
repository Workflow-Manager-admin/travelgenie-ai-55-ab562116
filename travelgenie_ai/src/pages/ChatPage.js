import React, { useState, useRef, useEffect } from "react";

// PUBLIC_INTERFACE
function ChatPage() {
  /**
   * Chat AI page: user chats travel Q&A with simulated AI (could connect to Cohere/OpenAI, demo fallback).
   */

  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm TravelGenie. Ask me anything about your trip or destination!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  // Placeholder for AI response (simulate with setTimeout)
  async function aiChatApi(question, contextMsgs) {
    // Use a real fetch to your own AI endpoint here
    return new Promise((resolve) => {
      setTimeout(() => {
        // Basic mock/echo plus example extra
        let resp = "That's an excellent question! Here's something you might find useful:\n";
        if (/paris/i.test(question)) resp += "Don't miss the Eiffel Tower and Louvre Museum in Paris!";
        else if (/weather/i.test(question)) resp += "You can check the local weather in our Weather Checker page!";
        else if (/budget/i.test(question)) resp += "Budget depends on your preferences, but I can suggest affordable lodging and sights.";
        else resp += "I recommend searching for top attractions or let me know your preferences for custom tips!";
        resolve(resp);
      }, 1300);
    });
  }

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;
    setMessages(msgs => [...msgs, { from: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const contextMsgs = messages.map(m => m.text).join("\n");
      const aiReply = await aiChatApi(question, contextMsgs);
      setMessages(msgs =>
        [...msgs, { from: "user", text: question }, { from: "ai", text: aiReply }]
      );
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
          style={inputStyle}
          placeholder="Type your travel question..."
          disabled={loading}
          autoFocus
        />
        <button className="btn btn-large" type="submit" disabled={loading || !input.trim()}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
      <div style={{marginTop:10, color:"var(--text-secondary)", fontSize:".96rem"}}>
        Try asking: <span style={{fontStyle:"italic"}}>What should I pack for Iceland? What to do in Paris?</span>
      </div>
    </div>
  );
}

const inputStyle = {
  flex: 1,
  padding: "10px 14px",
  fontSize: "1rem",
  borderRadius: "4px",
  border: "1px solid var(--border-color)",
  background: "#191c23",
  color: "var(--text-color)"
};

export default ChatPage;
