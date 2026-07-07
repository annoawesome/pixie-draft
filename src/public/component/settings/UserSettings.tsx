import React from "react";
import { downloadFromUrl } from "../../service/downloadClientService";
import { userDataService } from "../../service/userDataService";

export function UserSettings() {
  const onClickExportAllStories = async () => {
    const url = await userDataService.getDownloadUrl();

    if (url) {
      downloadFromUrl(url);
    } else {
    }
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
        <button type="button" className="button-secondary">
          Import stories
        </button>
      </div>
    </div>
  );
}
