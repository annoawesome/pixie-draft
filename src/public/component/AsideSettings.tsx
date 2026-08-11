import React, { useContext, useState } from "react";
import sanitize from "sanitize-filename";

import Story, { Stories } from "../type/storyType";
import Dialog from "./Dialog";
import { humanFileSize } from "../util/numberFormatting";
import { millisecondsToString } from "../util/time";
import * as storiesService from "../service/storiesService";
import GradientScrollable from "./GradientScrollable";
import ContentEditable from "./ContentEditable";
import CenterPanel from "./CenterPanel";
import { NotificationContext } from "./NotificationProvider";
import { humanReadableError } from "../service/displayErrorService";

function downloadText(text: string, mimeType: string, fileName: string) {
  const file = new Blob([text], {
    type: mimeType,
  });

  const anchor = document.createElement("a");
  const url = URL.createObjectURL(file);
  anchor.href = url;
  anchor.download = sanitize(fileName);

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
      <h1>Delete "{selectedStory.title}"?</h1>
      <p>
        This is an irreversible process. You will lose this story if you choose
        to delete it.
      </p>
      <div className="flex-row gap-medium">
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
  stories,
  setStories,
}: {
  stories: Stories;
  setStories: React.Dispatch<React.SetStateAction<Stories>>;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const selectedStory = storiesService.getSelectedStory(stories);

  const notificationContextObject = useContext(NotificationContext);

  const onClickDelete = () => {
    if (selectedStory) {
      setShowDialog(true);
    }
  };

  const onClickReallyDelete = async () => {
    setShowDialog(false);

    if (!selectedStory) return;

    const result = await storiesService.deleteSelectedStoryAndSave(stories);

    result.match({
      Ok: function (updatedStories: Stories): void {
        setStories(updatedStories);
      },
      Err: function (error: Error): void {
        console.error(error);
        notificationContextObject.setNotification(humanReadableError(error));
      },
    });
  };

  const onClickCancelDelete = () => {
    setShowDialog(false);
  };

  const onClickDuplicate = async () => {
    if (!selectedStory) return;

    const result = await storiesService.duplicateStoryAndSave(stories, {
      ...selectedStory,
      title: selectedStory.title + " (Copy)",
    });

    result.match({
      Ok: function (updatedStories: Stories): void {
        setStories(updatedStories);
      },
      Err: function (error: Error): void {
        console.error(error);
        notificationContextObject.setNotification(humanReadableError(error));
      },
    });
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

  const onClickClearHistory = async () => {
    if (!selectedStory) return; // Should never happen!

    const result =
      await storiesService.clearHistoryOfSelectedStoryAndSave(stories);

    result.match({
      Ok: function (updatedStories: Stories): void {
        setStories(updatedStories);
      },
      Err: function (error: Error): void {
        console.error(error);
        notificationContextObject.setNotification(humanReadableError(error));
      },
    });
  };

  const onUpdateContentEditable = async (newContent: string) => {
    if (!selectedStory) return;
    if (selectedStory.desc === newContent) return;

    const result = await storiesService.updateSelectedStoryWithUpdaterAndSave(
      stories,
      (story) => {
        return {
          ...story,
          desc: newContent,
          time: {
            ...story.time,
            modified: Date.now(),
          },
        };
      },
    );

    result.match({
      Ok: function (updatedStories: Stories): void {
        setStories(updatedStories);
      },
      Err: function (error: Error): void {
        console.error(error);
        notificationContextObject.setNotification(humanReadableError(error));
      },
    });
  };

  if (selectedStory) {
    return (
      <GradientScrollable>
        <aside className="flex-column side-column" id="aside-settings">
          {selectedStory ? (
            <>
              <div>
                <label htmlFor="story-desc" className="text-secondary">
                  Description
                </label>
                <ContentEditable
                  id="story-desc"
                  value={selectedStory.desc}
                  locked={false}
                  onUpdate={onUpdateContentEditable}
                />
              </div>
              <div className="separator"></div>
              <button className="button-secondary" onClick={onClickDuplicate}>
                Duplicate Story
              </button>
              <div className="separator"></div>
              <button
                className="button-secondary"
                onClick={onClickExportAsText}
              >
                Download as text
              </button>
              <button
                className="button-secondary"
                onClick={onClickExportAsJson}
              >
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
                {`Edited: ${millisecondsToString(selectedStory.time.modified)}`}
              </p>
              <div className="separator"></div>

              <p className="text-secondary">
                Story size:
                {" " +
                  humanFileSize(JSON.stringify(selectedStory).length, true)}
              </p>
              <p className="text-secondary">Id: {selectedStory.id}</p>

              <Dialog showDialog={showDialog} setShowDialog={setShowDialog}>
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
      </GradientScrollable>
    );
  } else {
    return (
      <CenterPanel className="div-elevated width-fill-max height-fill-max">
        <p>No story selected to modify.</p>
      </CenterPanel>
    );
  }
}
