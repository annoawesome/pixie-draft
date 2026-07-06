import React from "react";

export function UserSettings() {
  return (
    <div className="flex-column settings-section gap-medium" id="user-section">
      <h1>User Settings</h1>
      <div className="flex-row gap-small">
        <button type="button" className="button-secondary">
          Export all stories
        </button>
        <button type="button" className="button-secondary">
          Import stories
        </button>
      </div>
    </div>
  );
}
