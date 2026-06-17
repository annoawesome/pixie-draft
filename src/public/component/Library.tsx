import React, { useState } from "react";

import Story from "../type/storyType";
import { createStory, loadStory } from "../api/storiesApi";
import { millisecondsToString } from "../util/time";

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
    <button
      className="button-secondary flex-column story-card"
      onClick={onClickStoryCard}
    >
      <h2>{story.title}</h2>
      <p className="text-secondary">
        {story.time.modified !== -1
          ? `${millisecondsToString(story.time.modified)}`
          : "Has not been edited yet"}
      </p>
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
  const [search, setSearch] = useState("");

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

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      search.length === 0,
  );

  return (
    <div className="flex-column side-column scrollable" id="library">
      <button
        className="button-primary"
        id="new-story-button"
        onClick={onClickNewStoryButton}
      >
        Create Story
      </button>
      <input
        type="search"
        name=""
        className="input-secondary"
        id=""
        placeholder="Search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {search.length > 0 ? (
        <p className="text-secondary">
          {filteredStories.length} out of {stories.length} stories found
        </p>
      ) : (
        ""
      )}
      {filteredStories.map((story) => (
        <StoryCard
          key={story.id}
          apiToken={apiToken}
          story={story}
          setSelectedStory={setSelectedStory}
        />
      ))}
    </div>
  );
}
