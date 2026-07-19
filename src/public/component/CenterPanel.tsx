import React from "react";

export default function CenterPanel({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={"center-panel " + (className || "")} id={id}>
      {children}
    </div>
  );
}
