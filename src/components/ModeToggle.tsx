import type { Mode } from "../types/types";

type Props = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

const MODES: Mode[] = ["coach", "caddie"];

function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="mode-toggle" role="group" aria-label="assistant mode">
      {MODES.map((option) => (
        <button
          key={option}
          type="button"
          className={`mode-option ${mode === option ? "is-active" : ""}`}
          onClick={() => onChange(option)}
          aria-pressed={mode === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default ModeToggle;
