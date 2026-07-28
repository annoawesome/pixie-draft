import React from "react";

export default function Popover({
  className,
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      popover="auto"
      className={"popover " + (className ? className : "")}
      id={id}
    >
      {children}
    </div>
  );
}
