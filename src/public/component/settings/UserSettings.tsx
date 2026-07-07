import React, { useState } from "react";
import { downloadFromUrl } from "../../service/downloadClientService";
import { getDownloadUrl } from "../../service/userDataService";
import * as storiesService from "../../service/storiesService";
import Dialog from "../Dialog";

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
    const success = await storiesService.wipeExistingAndImportNewStories(file);

    if (!success) {
      alert("Oops, that file is invalid. Try again.");
    }

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
    const url = await getDownloadUrl();

    if (url) {
      downloadFromUrl(url);
    } else {
      /* empty */
      // Maybe do something if download URL cannot be generated?
    }
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
