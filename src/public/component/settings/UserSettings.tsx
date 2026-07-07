import React, { useState } from "react";
import { downloadFromUrl } from "../../service/downloadClientService";
import { getDownloadUrl } from "../../service/userDataService";
import Dialog from "../Dialog";

function ImportStoriesDialog({
  showImportStoriesDialog,
  setShowImportStoriesDialog,
}: {
  showImportStoriesDialog: boolean;
  setShowImportStoriesDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onClickCancelImportStories = () => setShowImportStoriesDialog(false);

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
        <input type="file" name="" id="" accept="application/json" />
        <div className="flex-row gap-small">
          <button type="button" className="button-secondary">
            Yes
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={onClickCancelImportStories}
          >
            No
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
