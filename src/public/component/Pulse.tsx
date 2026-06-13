import React from "react";

export default function Pulse({ active }: { active: boolean }) {
  return active ? (
    <div className="pulse-container">
      <div className="pulse"></div>
      <div className="circle circle-active"></div>
    </div>
  ) : (
    <div className="pulse-container">
      <div className="circle circle-inactive"></div>
    </div>
  );
}
