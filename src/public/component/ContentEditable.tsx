/**
 * A bespoke solution to a content-editable div
 */

import React, { useEffect, useRef } from "react";

function wrapInHtmlElement(element: string, section: string) {
  return `<${element}>${section}</${element}>`;
}

/**
 * Converts a line of text into HTML, following a subset of markdown. The following features are supported:
 *
 * \_text\_ -> \<i>text\</i>
 *
 * \_\_text\_\_ -> \<b>text\</b>
 *
 * \_\_\_text\_\_\_ -> \<i>\<b>text\</b>\</i>
 *
 * \# Header 1 -> \<h1>Header 1\</h1>
 *
 * \## Header 1 -> \<h2>Header 1\</h2>
 *
 * @param section A single line
 * @returns A single line wrapped in the appropriate HTML elements
 */
function convertMarkdownSectionToHtml(section: string) {
  section = section.replaceAll(
    /(?<![\w>])___.+?___(?![\w<])/g,
    (match) => `<i><b>${match}</b></i>`,
  );
  section = section.replaceAll(
    /(?<![\w>])__.+?__(?![\w<])/g,
    (match) => `<b>${match}</b>`,
  );
  section = section.replaceAll(
    /(?<![\w>])_.+?_(?![\w<])/g,
    (match) => `<i>${match}</i>`,
  );

  if (section.startsWith("# ")) {
    return wrapInHtmlElement("h1", section);
  } else if (section.startsWith("## ")) {
    return wrapInHtmlElement("h2", section);
  } else {
    return wrapInHtmlElement("p", section);
  }
}

function splitIntoParagraphs(text: string) {
  return text
    .split("\n")
    .map((section) => (section ? convertMarkdownSectionToHtml(section) : "")) // removes extra newline, sometimes not desirable and could be a bug
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

  const onBlurContentEditable = () => {
    const contentEditorDiv = contentEditableRef.current;

    if (contentEditorDiv) {
      onUpdate(pruneRedundantNewlines(contentEditorDiv.innerText));
    }
  };

  return (
    <div
      ref={contentEditableRef}
      id="story-content"
      className="input-secondary scrollable"
      contentEditable={!locked}
      onBlur={onBlurContentEditable}
    ></div>
  );
}
