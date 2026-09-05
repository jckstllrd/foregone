import type { RefObject } from "react";
import type { Mode } from "../types/types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  mode: Mode;
  isSending: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
};

function ChatInput({
  value,
  onChange,
  onSubmit,
  mode,
  isSending,
  inputRef,
}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="chat-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="chat-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Ask ${mode} anything...`}
        autoComplete="off"
      />
      <button
        type="submit"
        className={`send-button ${isSending ? "is-loading" : ""}`}
        disabled={isSending}
        aria-label="send"
      >
        →
      </button>
    </form>
  );
}

export default ChatInput;
