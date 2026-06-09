import React, { useState } from "react";

import {
  mutateStoryContent,
  mutateStoryTitle,
  saveStory,
  updateStoriesFromUpdatedStory,
} from "../api/storiesApi";
import Story from "../type/storyType";
import { generateResponse } from "../api/koboldCppApi";
import ContentEditable from "./ContentEditable";
import { RedoIcon, RefreshIcon, UndoIcon } from "./Icons";

export default function Editor({
  apiToken,
  selectedStory,
  stories,
  setSelectedStory,
  setStories,
}: {
  apiToken: string;
  selectedStory: Story | null;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const [locked, setLocked] = useState(false);
  const [apiUri, setApiUri] = useState("");

  const onChangeStoryTitle = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setSelectedStory((prev) =>
      prev ? mutateStoryTitle(prev, e.target.value) : null,
    );
  };

  const onBlurStoryTitle = () => {
    if (selectedStory) {
      saveStory(apiToken, selectedStory);
      setStories(updateStoriesFromUpdatedStory(stories, selectedStory));
    }
  };

  const onBlurStoryContent = (newContent: string) => {
    if (selectedStory) {
      const mutatedStory = mutateStoryContent(selectedStory, newContent);
      setSelectedStory(mutatedStory);
      saveStory(apiToken, mutatedStory);
    }
  };

  const onGenerate = () => {
    if (!selectedStory) {
      alert("No story loaded to generate with");
      return;
    }

    setLocked(true);

    // call LLM api
    generateResponse(apiUri, selectedStory.content)
      .then((text) => {
        setSelectedStory((prev) =>
          prev ? mutateStoryContent(prev, prev.content + text) : null,
        );
      })
      .finally(() => setLocked(false));
  };

  return (
    <div className="flex-column" id="editor">
      <input
        type="text"
        name="api-uri"
        id=""
        value={apiUri}
        placeholder="Put API URI here..."
        onChange={(e) => {
          setApiUri(e.target.value);
        }}
        onBlur={(e) => {
          setApiUri(e.target.value);
        }}
      />
      {selectedStory ? (
        <>
          <input
            type="text"
            id="story-title"
            autoComplete="false"
            placeholder="Story Title"
            value={selectedStory?.title}
            onChange={onChangeStoryTitle}
            onBlur={onBlurStoryTitle}
          />
          <ContentEditable
            value={selectedStory.content}
            onUpdate={onBlurStoryContent}
            locked={locked}
          />
          <div className="flex-row" id="action-bar">
            <div className="flex-row" id="action-bar-left">
              <button type="button">
                <UndoIcon />
              </button>
              <button type="button">
                <RedoIcon />
              </button>
              <button type="button">
                <RefreshIcon />
              </button>
            </div>
            <div className="flex-row" id="action-bar-right">
              <button type="button" onClick={onGenerate}>
                Generate
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>No story selected</p>
      )}
    </div>
  );
}
