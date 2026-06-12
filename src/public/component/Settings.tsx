import React from "react";

import EndpointProfilesSettings from "./settings/EndpointProfilesSettings";

export default function Settings({ apiToken }: { apiToken: string }) {
  return (
    <div className="flex-row" id="settings-layout">
      <aside className="flex-column" id="settings-sidebar">
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
