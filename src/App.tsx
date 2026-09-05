import { useRef, useState } from "react";
import ChatInput from "./components/ChatInput";
import ChatView from "./components/ChatView";
import ModeToggle from "./components/ModeToggle";
import Sidebar from "./components/Sidebar";
import type { Message, Mode } from "./types/types";

const apiUrl = import.meta.env.VITE_FOREGONE_API_URL;

function App() {
  const [mode, setMode] = useState<Mode>("caddie");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const appendAssistant = (token: string) => {
    setMessages((prev) => {
      const last = prev.at(-1);
      if (last?.role === "assistant") {
        return [
          ...prev.slice(0, -1),
          { ...last, content: last.content + token },
        ];
      }
      return [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: token },
      ];
    });
  };

  const handleSubmit = async () => {
    const text = prompt.trim();
    if (!text || isSending) return;

    const history: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: text },
    ];

    setMessages(history);
    setPrompt("");
    setIsChatOpen(true);
    setIsSending(true);

    try {
      const endpoint = mode === "coach" ? "/coach/chat" : "/caddie/chat";
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: "None",
          messages: [{ role: "user", content: text }],
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const flushFrame = (frame: string) => {
        if (frame.startsWith("data: ")) {
          appendAssistant(frame.slice("data: ".length));
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // a frame ends where the *next* one begins, not at any blank line —
        // a token's own text can contain "\n\n" (paragraph/list breaks)
        let nextFrameStart;
        while ((nextFrameStart = buffer.indexOf("\n\ndata: ")) !== -1) {
          flushFrame(buffer.slice(0, nextFrameStart));
          buffer = buffer.slice(nextFrameStart + 2);
        }
      }

      flushFrame(buffer.replace(/\n+$/, ""));
    } catch (error) {
      console.error("Request failed:", error);
      appendAssistant("something went wrong. try asking again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setPrompt("");
    inputRef.current?.focus();
  };

  return (
    <>
      <div
        className={`backdrop ${isChatOpen ? "is-chat" : ""}`}
        aria-hidden="true"
      />
      <div
        className={`scrim ${isChatOpen ? "is-chat" : ""}`}
        aria-hidden="true"
      />

      {isChatOpen ? (
        <div className="shell">
          <Sidebar
            mode={mode}
            onModeChange={setMode}
            onNewChat={handleNewChat}
          />

          <main className="chat-main">
            <header className="topbar">
              <span className="mark" role="img" aria-label="Foregone">
                f<span className="dot" />
              </span>
              <div className="topbar-actions">
                <button
                  type="button"
                  className="sidebar-action"
                  onClick={handleNewChat}
                >
                  + New
                </button>
                <ModeToggle mode={mode} onChange={setMode} />
              </div>
            </header>

            <ChatView messages={messages} mode={mode} isSending={isSending} />

            <div className="chat-dock">
              <ChatInput
                value={prompt}
                onChange={setPrompt}
                onSubmit={handleSubmit}
                mode={mode}
                isSending={isSending}
                inputRef={inputRef}
              />
            </div>
          </main>
        </div>
      ) : (
        <div className="landing">
          <ModeToggle mode={mode} onChange={setMode} />
          <h1 className="wordmark">foregone</h1>
          <p className="tagline">powered by caddie ai</p>
          <ChatInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleSubmit}
            mode={mode}
            isSending={isSending}
            inputRef={inputRef}
          />
        </div>
      )}
    </>
  );
}

export default App;
