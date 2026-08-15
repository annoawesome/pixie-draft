import React from "react";

export default function SquareButtonContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"div-square-button " + (className ? className : "")}>
      {children}
    </div>
  );
}
