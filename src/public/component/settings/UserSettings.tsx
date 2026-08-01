import React, { useState } from "react";
import { downloadFromUrl } from "../../service/downloadClientService";
import { getDownloadUrl } from "../../service/userDataService";
import * as storiesService from "../../service/storiesService";
import Dialog from "../Dialog";
import { HttpError } from "../../type/error/httpError";

function ImportStoriesDialog({
  showImportStoriesDialog,
  setShowImportStoriesDialog,
}: {
  showImportStoriesDialog: boolean;
  setShowImportStoriesDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onClickCancelImportStories = () => setShowImportStoriesDialog(false);

  const onChangeFileInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const files = event.target.files;

    if (!files) return;
    if (files.length !== 1) return;

    const file = files[0];

    // upload file
    const result = await storiesService.wipeExistingAndImportNewStories(file);

    result.match({
      Ok: () => {}, // TODO: Maybe tell the user that the operation succeeded?
      Err: function (error: Error): void {
        if (error instanceof HttpError && error.status === 400) {
          alert("Oops, that file is invalid. Try again.");
        } else {
          alert("An unknown error has occurred: " + error.message);
        }
      },
    });

    setShowImportStoriesDialog(false);
  };

  return (
    <Dialog
      showDialog={showImportStoriesDialog}
      setShowDialog={setShowImportStoriesDialog}
    >
      <form className="flex-column gap-medium">
        <h1>Import stories?</h1>
        <p>
          This will erase <i>all</i> of your currently saved stories!
        </p>
        <p>
          This is <i>not</i> intended for normal workflows, and should
          <i> only</i> be used when migrating data to a new backend. It is
          possible to corrupt your user data if one does not handle this process
          with care, and should only be done under guidance or supervision. If
          you wish to simply import an existing story without clearing existing
          data, this can be done in the main editor.
        </p>
        <input
          type="file"
          name=""
          id=""
          accept="application/json"
          onChange={onChangeFileInput}
        />
        <div className="flex-row gap-small">
          <button
            type="button"
            className="button-secondary width-fill-max"
            onClick={onClickCancelImportStories}
          >
            Cancel
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export function UserSettings() {
  const [showImportStoriesDialog, setShowImportStoriesDialog] = useState(false);

  const onClickExportAllStories = async () => {
    const result = await getDownloadUrl();

    result.match({
      Ok: downloadFromUrl,
      Err: function (error: Error): void {
        // Maybe do something more sophisticated if download URL cannot be generated?
        console.error(error);
        alert("Failed to generate download. Please try again later.");
      },
    });
  };

  const onClickImportStories = () => {
    setShowImportStoriesDialog(true);
  };

  return (
    <div className="flex-column settings-section gap-medium" id="user-section">
      <h1>User Settings</h1>
      <div className="flex-row gap-small">
        <button
          type="button"
          className="button-secondary"
          onClick={onClickExportAllStories}
        >
          Export all stories
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={onClickImportStories}
        >
          Import stories
        </button>
        <ImportStoriesDialog
          showImportStoriesDialog={showImportStoriesDialog}
          setShowImportStoriesDialog={setShowImportStoriesDialog}
        />
      </div>
    </div>
  );
}
