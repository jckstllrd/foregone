import { useState } from "react";
import ReactMarkdown from "react-markdown";

const apiUrl = import.meta.env.VITE_FOREGONE_API_URL;
console.log(apiUrl);
console.log("here");
function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [mode, setMode] = useState<"caddie" | "coach">("coach");

  const placeholder =
    mode === "coach" ? "how do i fix a slice..." : "i've landed in water...";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isStreaming) return;

    setIsStreaming(true);
    setResponse("");
    console.log(apiUrl);
    try {
      const endpoint = mode === "coach" ? "/coach/chat" : "/caddie/chat";
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: 0, messageContent: prompt }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const text: string = await res.json();
      setResponse(text);
    } catch (error) {
      console.error("Request failed:", error);
      setResponse("something went wrong. try asking again.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="page">
      <div className="mode-toggle" role="group" aria-label="assistant mode">
        <button
          type="button"
          className={`mode-option ${mode === "coach" ? "is-active" : ""}`}
          onClick={() => setMode("coach")}
          aria-pressed={mode === "coach"}
        >
          coach
        </button>
        <button
          type="button"
          className={`mode-option ${mode === "caddie" ? "is-active" : ""}`}
          onClick={() => setMode("caddie")}
          aria-pressed={mode === "caddie"}
        >
          caddie
        </button>
      </div>
      <h1 className="wordmark">foregone</h1>
      <p className="tagline">powered by caddie ai</p>

      {(response || isStreaming) && (
        <div className="response">
          {isStreaming ? (
            <span className="thinking">thinking…</span>
          ) : (
            <ReactMarkdown>{response}</ReactMarkdown>
          )}
        </div>
      )}

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isStreaming}
          placeholder={placeholder}
        />
        <button
          type="submit"
          className={`send-button ${isStreaming ? "is-loading" : ""}`}
          disabled={isStreaming}
          aria-label="send"
        >
          →
        </button>
      </form>
    </div>
  );
}

export default App;
