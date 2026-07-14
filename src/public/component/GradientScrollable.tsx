import React, { useState } from "react";

interface GradientMode {
  top: boolean;
  bottom: boolean;
}

function renderScrollableClasses(gradientMode: GradientMode) {
  const { bottom, top } = gradientMode;

  if (bottom && top) return "gradient-bottom gradient-top";
  if (bottom) return "gradient-bottom";
  if (top) return "gradient-top";
  return "";
}

function updateGradientMode(scrollable: HTMLDivElement): GradientMode {
  const top = scrollable.scrollTop <= 1;
  const bottom =
    Math.abs(
      scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop,
    ) <= 1;

  return {
    bottom,
    top,
  };
}

export default function GradientScrollable({
  children,
}: {
  children: React.ReactNode;
}) {
  const [gradientMode, setGradientMode] = useState<GradientMode>({
    top: true,
    bottom: false,
  });

  const onScrollGradientScrollable = (
    event: React.UIEvent<HTMLDivElement, UIEvent>,
  ) => {
    const scrollable = event.currentTarget;
    setGradientMode(updateGradientMode(scrollable));
  };

  return (
    <div
      className={
        "scrollable gradient-scrollable " +
        renderScrollableClasses(gradientMode)
      }
      onScroll={onScrollGradientScrollable}
    >
      {children}
    </div>
  );
}
