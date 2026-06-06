import React, { useState } from "react";

import {
  mutateStoryContent,
  mutateStoryTitle,
  saveStory,
  updateStoriesFromUpdatedStory,
} from "../api/storiesApi";
import Story from "../type/storyType";

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

  const onChangeStoryContent = (
    e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) => {
    const mutatedStory = selectedStory
      ? mutateStoryContent(selectedStory, e.target.value)
      : null;

    setSelectedStory(mutatedStory);
  };

  const onBlurStoryContent = () => {
    if (selectedStory) {
      saveStory(apiToken, selectedStory);
    }
  };

  const onGenerate = () => {
    setLocked(true);

    // call LLM api
  };

  return (
    <div id="editor">
      <input
        type="text"
        id="story-title"
        placeholder="Story Title"
        value={selectedStory?.title}
        onChange={onChangeStoryTitle}
        onBlur={onBlurStoryTitle}
      />
      <textarea
        id="story-content"
        placeholder="Write your story here..."
        value={selectedStory?.content || ""}
        disabled={locked}
        onChange={onChangeStoryContent}
        onBlur={onBlurStoryContent}
      />
      <button type="button" onClick={onGenerate}>
        Generate
      </button>
    </div>
  );
}
