import React from "react";

export default function SquareButtonContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="div-square-button">{children}</div>;
}
