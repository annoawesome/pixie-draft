import React, { useState } from "react";

import Story from "../type/storyType";
import { millisecondsToString } from "../util/time";
import { storiesClient } from "../client/storiesClient";

function StoryCard({
  story,
  selectedStory,
  setSelectedStory,
}: {
  story: Story;
  selectedStory: Story | null;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
}) {
  const onClickStoryCard = () => {
    const id = story.id;

    storiesClient.loadStory(id).then((fullStory) => {
      if (fullStory) {
        setSelectedStory(fullStory);
      }
    });
  };

  return (
    <button
      className={
        "button-secondary flex-column story-card" +
        (selectedStory?.id === story.id ? " button-selected" : "")
      }
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
  stories,
  selectedStory,
  setSelectedStory,
  setStories,
}: {
  selectedStory: Story | null;
  stories: Story[];
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const [search, setSearch] = useState("");

  const onClickNewStoryButton = () => {
    storiesClient
      .createStory("New Story", "Once upon a time...")
      .then((newStory) => {
        if (newStory) {
          setSelectedStory(newStory);
          setStories((prev) => [newStory, ...prev]);
        }
      });
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
          story={story}
          selectedStory={selectedStory}
          setSelectedStory={setSelectedStory}
        />
      ))}
    </div>
  );
}
