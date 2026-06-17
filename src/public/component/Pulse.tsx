import React from "react";

export default function Pulse({
  active,
  title,
}: {
  active: boolean;
  title: string;
}) {
  return active ? (
    <div className="pulse-container" title={title}>
      <div className="pulse"></div>
      <div className="circle circle-active"></div>
    </div>
  ) : (
    <div className="pulse-container" title={title}>
      <div className="circle circle-inactive"></div>
    </div>
  );
}
