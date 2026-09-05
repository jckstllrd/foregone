import ModeToggle from "./ModeToggle";
import type { Mode } from "../types/types";

type Props = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onNewChat: () => void;
};

function Sidebar({ mode, onModeChange, onNewChat }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <span className="wordmark wordmark-sidebar">foregone</span>
        <ModeToggle mode={mode} onChange={onModeChange} />
        <button type="button" className="sidebar-action" onClick={onNewChat}>
          + New chat
        </button>
      </div>

      <div className="sidebar-middle">
        <p className="sidebar-label">Conversations</p>
        <ul className="sidebar-list">
          {
            // need to add conversation creation/handling
          }
        </ul>
      </div>

      <div className="sidebar-bottom">
        <span className="sidebar-row" aria-disabled="true">
          Sign in
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
