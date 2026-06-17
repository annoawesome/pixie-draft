/**
 * A bespoke solution to a content-editable div
 */

import React, { useEffect, useRef } from "react";

function splitIntoParagraphs(text: string) {
  return text
    .split("\n")
    .map((section) => (section ? `<p>${section}</p>` : "")) // removes extra newline, sometimes not desirable and could be a bug
    .join("\n");
}

function setContentEditableContents(
  contentEditable: HTMLDivElement,
  text: string,
) {
  contentEditable.innerHTML = splitIntoParagraphs(text);
}

function pruneRedundantNewlines(text: string) {
  return text.replace(/\n\s*\n/g, "\n");
}

export default function ContentEditable({
  value,
  locked,
  onUpdate,
  ref,
}: {
  value: string;
  locked: boolean;
  onUpdate: (newContent: string) => void;
  ref?: React.RefObject<HTMLDivElement | null>;
}) {
  const contentEditableRef = ref || useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentEditableRef.current) {
      setContentEditableContents(contentEditableRef.current, value);
    }
  }, [value]);

  return (
    <div
      ref={contentEditableRef}
      id="story-content"
      className="input-secondary scrollable"
      contentEditable={!locked}
      onBlur={() => {
        const contentEditorDiv = contentEditableRef.current;

        if (contentEditorDiv) {
          onUpdate(pruneRedundantNewlines(contentEditorDiv.innerText));
        }
      }}
    ></div>
  );
}
