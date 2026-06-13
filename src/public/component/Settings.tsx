import React, { useState } from "react";

import EndpointProfilesSettings from "./settings/EndpointProfilesSettings";
import { SidebarIcon, UndoIcon } from "./Icons";
import { CurrentPage } from "../type/currentPageType";

function SidebarActionsBar({
  hideSidebar,
  setHideSidebar,
  setCurrentPage,
}: {
  hideSidebar: boolean;
  setHideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}) {
  return (
    <div className="flex-row width-fill-max">
      <div className="flex-row width-fill-max">
        <button
          type="button"
          className="button-tertiary button-icon"
          title="Return to main editor"
          hidden={hideSidebar}
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
          onClick={() => setHideSidebar(!hideSidebar)}
        >
          <SidebarIcon />
        </button>
      </div>
    </div>
  );
}

function SettingsSidebar({
  hideSidebar,
  setHideSidebar,
  setCurrentPage,
}: {
  hideSidebar: boolean;
  setHideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}) {
  return (
    <aside
      className={"flex-column sidebar" + (hideSidebar ? " sidebar-small" : "")}
      id="settings-sidebar"
    >
      <SidebarActionsBar
        hideSidebar={hideSidebar}
        setHideSidebar={setHideSidebar}
        setCurrentPage={setCurrentPage}
      />
      <button
        className="button-tertiary button-settings-sidebar"
        hidden={hideSidebar}
      >
        Endpoint Profiles
      </button>
    </aside>
  );
}

export default function Settings({
  apiToken,
  setCurrentPage,
}: {
  apiToken: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}) {
  const [hideSidebar, setHideSidebar] = useState(false);

  return (
    <div className="flex-row" id="settings-layout">
      <SettingsSidebar
        hideSidebar={hideSidebar}
        setHideSidebar={setHideSidebar}
        setCurrentPage={setCurrentPage}
      />
      <main className="width-fill-max" id="">
        <EndpointProfilesSettings apiToken={apiToken} />
      </main>
    </div>
  );
}
