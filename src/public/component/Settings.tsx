import React from "react";

function EndpointsSettings() {
  return (
    <div className="flex-row settings-section" id="settings-endpoints-section">
      <div className="width-fill-max">
        <h1>Endpoints</h1>
        <div className="flex-column" id="settings-endpoints-list">
          <button className="button-secondary">
            <h2>Automatic</h2>
            <p>
              Automatically checks for possible endpoint URIs. This cannot be
              deleted.
            </p>
          </button>
          <button className="button-secondary">
            <h2>A Really Nice Endpoint</h2>
            <p>http://my_endpoint:5001</p>
          </button>
        </div>
      </div>
      <div className="flex-column width-fill-max">
        <form className="flex-column" id="settings-endpoints-editor">
          <input
            type="text"
            name=""
            className="input-secondary"
            id=""
            placeholder="My Endpoint"
          />
          <input
            type="text"
            className="input-secondary"
            placeholder="http://localhost:5001"
          />
          <button type="submit" className="button-secondary">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="flex-row" id="settings-layout">
      <aside className="flex-column" id="settings-sidebar">
        <button className="button-tertiary button-settings-sidebar">
          Endpoint Profiles
        </button>
      </aside>
      <main className="width-fill-max" id="">
        <EndpointsSettings />
      </main>
    </div>
  );
}
