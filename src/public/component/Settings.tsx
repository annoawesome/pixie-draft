import React from "react";

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

function EndpointsSettings() {
  const endpoints: Endpoint[] = [
    {
      id: "",
      name: "My Endpoint",
      uri: "my_endpoint",
    },
  ];

  return (
    <div className="flex-row settings-section" id="settings-endpoints-section">
      <div className="width-fill-max">
        <h1>Endpoints</h1>
        <EndpointsList endpoints={endpoints} />
      </div>
      <div className="flex-column width-fill-max">
        <EndpointEditor />
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
