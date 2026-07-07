import React, { useState } from "react";

import EndpointProfilesSettings from "./settings/EndpointProfilesSettings";
import { SidebarIcon, UndoIcon } from "./Icons";
import { CurrentPage } from "../type/currentPageType";
import SquareButtonContainer from "./SquareButtonContainer";
import { UserSettings } from "./settings/UserSettings";

function SidebarActionsBar({
  hideSidebar,
  setHideSidebar,
  setCurrentPage,
}: {
  hideSidebar: boolean;
  setHideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}) {
  const onClickReturnToMainEditor = () => setCurrentPage("main");
  const onClickHideSidebar = () => setHideSidebar(!hideSidebar);

  return (
    <div className="flex-row width-fill-max">
      <div className="flex-row width-fill-max">
        <SquareButtonContainer>
          <button
            type="button"
            className="button-tertiary button-icon"
            title="Return to main editor"
            hidden={hideSidebar}
            onClick={onClickReturnToMainEditor}
          >
            <UndoIcon />
          </button>
        </SquareButtonContainer>
      </div>
      <div className="flex-row-right width-fill-max">
        <SquareButtonContainer>
          <button
            type="button"
            className="button-tertiary button-icon"
            title="Hide sidebar"
            onClick={onClickHideSidebar}
          >
            <SidebarIcon />
          </button>
        </SquareButtonContainer>
      </div>
    </div>
  );
}

function SettingsSidebar({
  hideSidebar,
  setHideSidebar,
  setCurrentPage,
  setSection,
}: {
  hideSidebar: boolean;
  setHideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
  setSection: React.Dispatch<React.SetStateAction<string>>;
}) {
  const buildSectionSetter = (section: string) => {
    return () => setSection(section);
  };

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
        onClick={buildSectionSetter("user")}
      >
        User
      </button>
      <button
        className="button-tertiary button-settings-sidebar"
        hidden={hideSidebar}
        onClick={buildSectionSetter("endpoint-profiles")}
      >
        Endpoint Profiles
      </button>
    </aside>
  );
}

function renderSettings(section: string) {
  switch (section) {
    case "user":
      return <UserSettings />;

    case "endpoint-profiles":
      return <EndpointProfilesSettings />;

    default:
      return null;
  }
}

export default function Settings({
  setCurrentPage,
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}) {
  const [hideSidebar, setHideSidebar] = useState(false);
  const [section, setSection] = useState("endpoint-profiles");

  return (
    <div className="flex-row" id="settings-layout">
      <SettingsSidebar
        hideSidebar={hideSidebar}
        setHideSidebar={setHideSidebar}
        setCurrentPage={setCurrentPage}
        setSection={setSection}
      />
      <main className="width-fill-max" id="settings-column">
        {renderSettings(section)}
      </main>
    </div>
  );
}
