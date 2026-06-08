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

export default function ContentEditable({
  value,
  locked,
  onUpdate,
}: {
  value: string;
  locked: boolean;
  onUpdate: (newContent: string) => void;
}) {
  const contentEditableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentEditableRef.current) {
      setContentEditableContents(contentEditableRef.current, value);
    }
  }, [value]);

  return (
    <div
      ref={contentEditableRef}
      id="story-content"
      contentEditable={!locked}
      onBlur={() => {
        const contentEditorDiv = contentEditableRef.current;

        if (contentEditorDiv) {
          console.log(contentEditorDiv.textContent);
          onUpdate(contentEditorDiv.innerText);
        }
      }}
    ></div>
  );
}
