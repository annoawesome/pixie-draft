import React, { useState } from "react";

import { saveStory } from "../api/storiesApi";

import Story, {
  mutateStoryFromAppendingHistory,
  mutateStoryFromHistoryPageFlip,
  mutateStoryTitle,
  updateStoriesFromUpdatedStory,
} from "../type/storyType";
import { generateResponse } from "../api/koboldCppApi";
import ContentEditable from "./ContentEditable";
import { RedoIcon, RefreshIcon, UndoIcon } from "./Icons";

function ActionBar({
  apiUri,
  selectedStory,
  locked,
  setSelectedStory,
  setLocked,
}: {
  apiUri: string;
  selectedStory: Story;
  locked: boolean;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
          prev
            ? mutateStoryFromAppendingHistory(prev, prev.content + text)
            : null,
        );
      })
      .finally(() => setLocked(false));
  };

  return (
    <div className="flex-row width-fill-max" id="action-bar">
      <div className="flex-row width-fill-max" id="action-bar-left">
        <button
          className="button-secondary"
          type="button"
          disabled={selectedStory.historyIndex === 0 || locked}
          onClick={() => {
            setSelectedStory(mutateStoryFromHistoryPageFlip(selectedStory, -1));
          }}
        >
          <UndoIcon />
        </button>
        <button
          className="button-secondary"
          type="button"
          disabled={
            selectedStory.historyIndex === selectedStory.history.length - 1 ||
            locked
          }
          onClick={() => {
            console.log(selectedStory);
            setSelectedStory(mutateStoryFromHistoryPageFlip(selectedStory, 1));
          }}
        >
          <RedoIcon />
        </button>
        <button
          className="button-secondary"
          type="button"
          disabled={selectedStory.historyIndex === 0 || locked}
        >
          <RefreshIcon />
        </button>
      </div>
      <div className="flex-row-right width-fill-max" id="action-bar-right">
        <button
          className="button-secondary"
          type="button"
          disabled={locked}
          onClick={onGenerate}
        >
          Generate
        </button>
      </div>
    </div>
  );
}

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
      const mutatedStory = mutateStoryFromAppendingHistory(
        selectedStory,
        newContent,
      );

      setSelectedStory(mutatedStory);
      saveStory(apiToken, mutatedStory);
    }
  };

  return (
    <div className="flex-column width-fill-max" id="editor">
      <input
        type="text"
        name="api-uri"
        className="input-secondary"
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
            className="input-secondary"
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
          <ActionBar
            apiUri={apiUri}
            selectedStory={selectedStory}
            locked={locked}
            setSelectedStory={setSelectedStory}
            setLocked={setLocked}
          />
        </>
      ) : (
        <p>No story selected</p>
      )}
    </div>
  );
}
