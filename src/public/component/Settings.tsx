import React, { useEffect, useState } from "react";
import { getSettings } from "../api/settingsApi";

interface Endpoint {
  id: string;
  name: string;
  uri: string;
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <button className="button-secondary">
      <h2>{endpoint.name}</h2>
      <p>{endpoint.uri}</p>
    </button>
  );
}

function EndpointsList({ endpoints }: { endpoints: Endpoint[] }) {
  return (
    <div className="flex-column" id="settings-endpoints-list">
      <EndpointCard
        endpoint={{
          id: "automatic",
          name: "Automatic",
          uri: "auto-generated",
        }}
      />
      {endpoints.map((endpoint, index) => (
        <EndpointCard key={index} endpoint={endpoint} />
      ))}
    </div>
  );
}

function EndpointEditor() {
  return (
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
  );
}

function EndpointsSettings({ apiToken }: { apiToken: string }) {
  const [endpoints, setEndpoints] = useState<Endpoint[] | null>(null);

  useEffect(() => {
    getSettings(apiToken).then((settings) => {
      // WARNING: not type checked or validated at all!
      setEndpoints(settings.endpoints);
    });
  }, []);

  return (
    <div className="flex-row settings-section" id="settings-endpoints-section">
      <div className="width-fill-max">
        <h1>Endpoints</h1>
        {endpoints ? (
          <EndpointsList endpoints={endpoints} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="flex-column width-fill-max">
        <EndpointEditor />
      </div>
    </div>
  );
}

export default function Settings({ apiToken }: { apiToken: string }) {
  return (
    <div className="flex-row" id="settings-layout">
      <aside className="flex-column" id="settings-sidebar">
        <button className="button-tertiary button-settings-sidebar">
          Endpoint Profiles
        </button>
      </aside>
      <main className="width-fill-max" id="">
        <EndpointsSettings apiToken={apiToken} />
      </main>
    </div>
  );
}
