import React from "react";

import { deleteStory } from "../api/storiesApi";
import Story, { removeStoryFromStories } from "../type/storyType";

function downloadText(text: string, mimeType: string, fileName: string) {
  const file = new Blob([text], {
    type: mimeType,
  });

  const anchor = document.createElement("a");
  const url = URL.createObjectURL(file);
  anchor.href = url;
  anchor.download = fileName;

  document.body.append(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 0);
}

export default function AsideSettings({
  apiToken,
  selectedStory,
  setSelectedStory,
  stories,
  setStories,
}: {
  apiToken: string;
  selectedStory: Story | null;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const onClickDelete = () => {
    if (selectedStory) {
      deleteStory(apiToken, selectedStory.id);
      setStories(removeStoryFromStories(stories, selectedStory));
      setSelectedStory(null);
    }
  };

  const onClickExportAsText = () => {
    downloadText(
      selectedStory?.content ?? "",
      "text/plain",
      selectedStory?.title ?? "story",
    );
  };

  const onClickExportAsJson = () => {
    downloadText(
      JSON.stringify(selectedStory),
      "application/json",
      selectedStory?.title ?? "story",
    );
  };

  return (
    <aside className="flex-column side-column" id="aside-settings">
      {selectedStory ? (
        <>
          <button className="button-secondary" onClick={onClickExportAsText}>
            Download as text
          </button>
          <button className="button-secondary" onClick={onClickExportAsJson}>
            Download as JSON
          </button>

          <button className="button-secondary" onClick={onClickDelete}>
            Delete
          </button>
        </>
      ) : (
        <></>
      )}
    </aside>
  );
}
