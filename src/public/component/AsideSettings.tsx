import React from "react";

import { deleteStory } from "../api/storiesApi";
import Story, { removeStoryFromStories } from "../type/storyType";

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
  return (
    <aside className="flex-column side-column" id="aside-settings">
      <button className="button-secondary" onClick={onClickDelete}>
        Delete
      </button>
    </aside>
  );
}
