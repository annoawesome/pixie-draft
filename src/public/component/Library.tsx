import React, { useState } from "react";

import Story, { Stories, StoryPreview } from "../type/storyType";
import { millisecondsToString } from "../util/time";
import * as storiesService from "../service/storiesService";
import Dialog from "./Dialog";
import MimeTypes from "../type/mimeType";
import GradientScrollable from "./GradientScrollable";

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
        {`${millisecondsToString(story.time.modified)}`}
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
  const [showImportDialog, setShowImportDialog] = useState(false);

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

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(event.target.value);

  const onClickImport = () => setShowImportDialog(true);

  const onChangeFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // Do not lock the user out in case any mishaps occur
    setShowImportDialog(false);

    const importedFiles = event.target.files;

    if (!importedFiles || importedFiles.length !== 1) return;

    const file = importedFiles[0];
    const storyContent = await file.text();

    if (!storyContent) return;

    if (file.type === MimeTypes.TEXT) {
      const updatedStories = await storiesService.createStoryAndSave(
        stories,
        file.name.substring(0, file.name.lastIndexOf(".")),
        storyContent,
      );

      if (updatedStories) {
        setStories(updatedStories);
      }
    } else if (file.type === MimeTypes.JSON) {
      // NOTE: story is not validated at all
      const story: Story = JSON.parse(storyContent);

      const updatedStories = await storiesService.duplicateStoryAndSave(
        stories,
        story,
      );

      if (updatedStories) {
        setStories(updatedStories);
      }
    }
  };

  const onClickCancelImport = () => setShowImportDialog(false);

  const allPreviews = storiesService.toLibraryPreview(stories);
  const filteredPreviews = storiesService.searchLibraryPreview(
    allPreviews,
    search,
  );

  return (
    <GradientScrollable>
      <div className="flex-column side-column" id="library">
        <button
          className="button-primary"
          id="new-story-button"
          onClick={onClickNewStoryButton}
        >
          Create Story
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={onClickImport}
        >
          Import
        </button>
        <input
          type="search"
          name=""
          className="input-secondary"
          id=""
          placeholder="Search"
          value={search}
          onChange={onChangeSearch}
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
        <Dialog
          showDialog={showImportDialog}
          setShowDialog={setShowImportDialog}
        >
          <div className="flex-column gap-medium">
            <h1>Import story</h1>
            <input
              type="file"
              accept={[MimeTypes.TEXT, MimeTypes.JSON].join()}
              onChange={onChangeFileImport}
            />
            <button
              type="button"
              className="button-secondary"
              onClick={onClickCancelImport}
            >
              Cancel
            </button>
          </div>
        </Dialog>
      </div>
    </GradientScrollable>
  );
}
