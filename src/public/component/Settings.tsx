import React from "react";

import EndpointProfilesSettings from "./settings/EndpointProfilesSettings";
import { SidebarIcon, UndoIcon } from "./Icons";
import { CurrentPage } from "../type/currentPageType";

export default function Settings({
  apiToken,
  setCurrentPage,
}: {
  apiToken: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}) {
  return (
    <div className="flex-row" id="settings-layout">
      <aside className="flex-column" id="settings-sidebar">
        <div className="flex-row width-fill-max">
          <div className="flex-row width-fill-max">
            <button
              type="button"
              className="button-tertiary button-icon"
              title="Return to main editor"
              onClick={() => setCurrentPage("main")}
            >
              <UndoIcon />
            </button>
          </div>
          <div className="flex-row-right width-fill-max">
            <button
              type="button"
              className="button-tertiary button-icon"
              title="Hide sidebar"
            >
              <SidebarIcon />
            </button>
          </div>
        </div>
        <button className="button-tertiary button-settings-sidebar">
          Endpoint Profiles
        </button>
      </aside>
      <main className="width-fill-max" id="">
        <EndpointProfilesSettings apiToken={apiToken} />
      </main>
    </div>
  );
}
