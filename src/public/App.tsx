import React from "react";

export default function App() {
  return (
    <div className="three-column-layout">
      <div id="library">
        <button className="story-card">
          <h2>Story 1</h2>
        </button>
        <button className="story-card">
          <h2>Story 2</h2>
        </button>
      </div>
      <div id="editor">
        <input type="text" id="story-title" placeholder="Story Title" />
        <textarea id="story-content" placeholder="Write your story here..." />
      </div>
    </div>
  );
}
