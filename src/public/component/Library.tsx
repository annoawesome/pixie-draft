import React from "react";

import Story from "../type/storyType";
import { createStory, loadStory } from "../api/storiesApi";

function StoryCard({
  story,
  setSelectedStory,
}: {
  story: Story;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
}) {
  const onClickStoryCard = () => {
    const id = story.id;

    loadStory(id).then((fullStory) => {
      if (fullStory) {
        setSelectedStory(fullStory);
      }
    });
  };

  return (
    <button className="story-card" onClick={onClickStoryCard}>
      <h2>{story.title}</h2>
    </button>
  );
}

export default function Library({
  stories,
  setSelectedStory,
  setStories,
}: {
  stories: Story[];
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const onClickNewStoryButton = () => {
    createStory("New Story", "Once upon a time...").then((newStory) => {
      if (newStory) {
        setSelectedStory(newStory);
        setStories((prev) => [...prev, newStory]);
      }
    });
  };

  return (
    <div id="library">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          setSelectedStory={setSelectedStory}
        />
      ))}
      <button id="new-story-button" onClick={onClickNewStoryButton}>
        New Story
      </button>
    </div>
  );
}
