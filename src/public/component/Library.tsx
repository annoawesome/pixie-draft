import React from "react";

import Story from "../type/storyType";
import { createStory, loadStory } from "../api/storiesApi";

function StoryCard({
  apiToken,
  story,
  setSelectedStory,
}: {
  apiToken: string;
  story: Story;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
}) {
  const onClickStoryCard = () => {
    const id = story.id;

    loadStory(apiToken, id).then((fullStory) => {
      if (fullStory) {
        setSelectedStory(fullStory);
      }
    });
  };

  return (
    <button className="button-secondary story-card" onClick={onClickStoryCard}>
      <h2>{story.title}</h2>
    </button>
  );
}

export default function Library({
  apiToken,
  stories,
  setSelectedStory,
  setStories,
}: {
  apiToken: string;
  stories: Story[];
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const onClickNewStoryButton = () => {
    createStory(apiToken, "New Story", "Once upon a time...").then(
      (newStory) => {
        if (newStory) {
          setSelectedStory(newStory);
          setStories((prev) => [...prev, newStory]);
        }
      },
    );
  };

  return (
    <div className="flex-column" id="library">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          apiToken={apiToken}
          story={story}
          setSelectedStory={setSelectedStory}
        />
      ))}
      <button
        className="button-secondary"
        id="new-story-button"
        onClick={onClickNewStoryButton}
      >
        New Story
      </button>
    </div>
  );
}
