import React, { useState } from "react";

import { Stories, StoryPreview } from "../type/storyType";
import { millisecondsToString } from "../util/time";
import * as storiesService from "../service/storiesService";

function StoryCard({
  story,
  stories,
  setStories,
}: {
  story: StoryPreview;
  stories: Stories;
  setStories: React.Dispatch<React.SetStateAction<Stories>>;
}) {
  const onClickStoryCard = async () => {
    const id = story.id;
    const updatedStories = await storiesService.loadStoryAndUpdate(stories, id);

    if (updatedStories) {
      setStories(updatedStories);
    }
  };

  const selectedStory = storiesService.getSelectedStory(stories);

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
  setStories,
}: {
  stories: Stories;
  setStories: React.Dispatch<React.SetStateAction<Stories>>;
}) {
  const [search, setSearch] = useState("");

  const onClickNewStoryButton = async () => {
    const updatedStories = await storiesService.createStoryAndSave(
      stories,
      "New Story",
      "Once upon a time...",
    );

    if (updatedStories) {
      setStories(updatedStories);
    }
  };

  const allPreviews = storiesService.toLibraryPreview(stories);
  const filteredPreviews = storiesService.searchLibraryPreview(
    allPreviews,
    search,
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
          {filteredPreviews.length} out of {allPreviews.length} stories found
        </p>
      ) : (
        ""
      )}
      {filteredPreviews.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          stories={stories}
          setStories={setStories}
        />
      ))}
    </div>
  );
}
