import { useState } from "react";
const apiUrl = import.meta.env.VITE_FOREGONE_API_URL;

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isStreaming) return;

    setIsStreaming(true);
    setResponse("");

    try {
      const res = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      if (!res.body) throw new Error("ReadableStream not supported.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setResponse((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error("Streaming failed:", error);
      setResponse(
        (prev) =>
          prev + "\n\n[Error: Connection failed. Check CORS or server status.]",
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>⛳ Caddie</h1>
      <p style={{ color: "#666" }}>AI Assistant for Golf Queries</p>

      <div
        style={{
          minHeight: "200px",
          padding: "16px",
          background: "#f5f5f5",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
          marginBottom: "20px",
          border: "1px solid #ddd",
        }}
      >
        {response || "Ask a golf question..."}
        {isStreaming && <span style={{ opacity: 0.5 }}> █</span>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isStreaming}
          style={{
            flexGrow: 1,
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          placeholder="e.g., How do I fix a slice?"
        />
        <button
          type="submit"
          disabled={isStreaming}
          style={{
            padding: "12px 24px",
            borderRadius: "4px",
            background: isStreaming ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            cursor: isStreaming ? "not-allowed" : "pointer",
          }}
        >
          {isStreaming ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default App;
