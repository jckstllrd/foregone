import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Message, Mode } from "../types/types";

type Props = {
  messages: Message[];
  mode: Mode;
  isSending: boolean;
};

function ChatView({ messages, mode, isSending }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const awaitingReply = isSending && messages.at(-1)?.role === "user";

  return (
    <div className="chat-scroll" ref={scrollRef}>
      <div className="conversation">
        <p className="conversation-mode">{mode}</p>

        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="turn turn-user">
              {message.content}
            </div>
          ) : (
            <div key={message.id} className="turn turn-assistant response">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ),
        )}

        {awaitingReply && (
          <div className="turn turn-assistant">
            <span className="thinking">thinking…</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatView;
