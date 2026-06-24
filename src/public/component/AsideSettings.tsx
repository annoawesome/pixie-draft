import React, { useState } from "react";

import Story, {
  mutateStoryFromRemovingHistory,
  removeStoryFromStories,
} from "../type/storyType";
import Dialog from "./Dialog";
import { humanFileSize } from "../util/numberFormatting";
import { millisecondsToString } from "../util/time";
import { storiesClient } from "../client/storiesClient";

function downloadText(text: string, mimeType: string, fileName: string) {
  const file = new Blob([text], {
    type: mimeType,
  });

  const anchor = document.createElement("a");
  const url = URL.createObjectURL(file);
  anchor.href = url;
  anchor.download = fileName;

  document.body.append(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 0);
}

function DialogBox({
  selectedStory,
  onClickCancelDelete,
  onClickReallyDelete,
}: {
  selectedStory: Story;
  onClickCancelDelete: () => void;
  onClickReallyDelete: () => void;
}) {
  return (
    <div className="flex-column gap-medium">
      <h2>Delete "{selectedStory.title}"?</h2>
      <p>
        This is an irreversible process. You will lose this story if you choose
        to delete it.
      </p>
      <div className="flex-row gap-small">
        <button
          type="button"
          className="button-secondary width-fill-max"
          onClick={onClickCancelDelete}
        >
          Cancel
        </button>
        <button
          type="button"
          className="button-primary button-destructive width-fill-max"
          onClick={onClickReallyDelete}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
}

export default function AsideSettings({
  selectedStory,
  setSelectedStory,
  stories,
  setStories,
}: {
  selectedStory: Story | null;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const [showDialog, setShowDialog] = useState(false);

  const onClickDelete = () => {
    if (selectedStory) {
      setShowDialog(true);
    }
  };

  const onClickReallyDelete = () => {
    setShowDialog(false);

    if (selectedStory) {
      storiesClient.deleteStory(selectedStory.id);
      setStories(removeStoryFromStories(stories, selectedStory));
      setSelectedStory(null);
    }
  };

  const onClickCancelDelete = () => {
    setShowDialog(false);
  };

  const onClickDuplicate = () => {
    if (selectedStory) {
      storiesClient.duplicateStory(selectedStory).then((newStory) => {
        if (newStory) {
          storiesClient.saveStory(newStory);

          setSelectedStory(newStory);
          setStories((prev) => [newStory, ...prev]);
        }
      });
    }
  };

  const onClickExportAsText = () => {
    downloadText(
      selectedStory?.content ?? "",
      "text/plain",
      selectedStory?.title ?? "story",
    );
  };

  const onClickExportAsJson = () => {
    downloadText(
      JSON.stringify(selectedStory),
      "application/json",
      selectedStory?.title ?? "story",
    );
  };

  const onClickClearHistory = () => {
    if (!selectedStory) return; // Should never happen!

    const updatedStory = mutateStoryFromRemovingHistory(selectedStory);

    storiesClient.saveStory(updatedStory).then((success) => {
      if (success) {
        setSelectedStory(updatedStory);
      }
    });
  };

  return (
    <aside className="flex-column side-column scrollable" id="aside-settings">
      {selectedStory ? (
        <>
          <button className="button-secondary" onClick={onClickDuplicate}>
            Duplicate Story
          </button>
          <div className="separator"></div>
          <button className="button-secondary" onClick={onClickExportAsText}>
            Download as text
          </button>
          <button className="button-secondary" onClick={onClickExportAsJson}>
            Download as JSON
          </button>
          <div className="separator"></div>
          <button
            type="button"
            className="button-secondary"
            onClick={onClickClearHistory}
          >
            Clear History
          </button>
          <button
            className="button-secondary button-destructive"
            onClick={onClickDelete}
          >
            Delete
          </button>
          <div className="separator"></div>

          <p className="text-secondary">
            Word count: {selectedStory.content.split(/[\s]+/).length}
          </p>
          <p className="text-secondary">
            Sentence count:{" "}
            {
              selectedStory.content
                .split(/[!?.]+/)
                .filter((sentence) => sentence.length > 0).length
            }
          </p>
          <p className="text-secondary">
            Created: {millisecondsToString(selectedStory.time.created)}
          </p>
          <p className="text-secondary">
            {selectedStory.time.modified !== -1
              ? `Edited: ${millisecondsToString(selectedStory.time.modified)}`
              : "Has not been edited yet"}
          </p>
          <div className="separator"></div>

          <p className="text-secondary">
            Story size:
            {" " + humanFileSize(JSON.stringify(selectedStory).length, true)}
          </p>
          <p className="text-secondary">Id: {selectedStory.id}</p>

          <Dialog showDialog={showDialog}>
            <DialogBox
              selectedStory={selectedStory}
              onClickCancelDelete={onClickCancelDelete}
              onClickReallyDelete={onClickReallyDelete}
            />
          </Dialog>
        </>
      ) : (
        <></>
      )}
    </aside>
  );
}
