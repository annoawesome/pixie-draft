import React, { useEffect, useState } from "react";
import { getSettings } from "../api/settingsApi";

interface Endpoint {
  id: string;
  name: string;
  uri: string;
}

function EndpointCard({
  endpoint,
  selectedEndpointId,
  setSelectedEndpointId,
  locked,
}: {
  endpoint: Endpoint;
  selectedEndpointId: string;
  setSelectedEndpointId: React.Dispatch<React.SetStateAction<string>>;
  locked: boolean;
}) {
  return (
    <button
      className="button-secondary"
      disabled={locked}
      id={
        endpoint.id === selectedEndpointId
          ? "settings-selected-endpoint-card"
          : undefined
      }
      onClick={() => setSelectedEndpointId(endpoint.id)}
    >
      <h2>{endpoint.name}</h2>
      <p>{endpoint.uri}</p>
    </button>
  );
}

function EndpointsList({
  endpoints,
  selectedEndpointId,
  setSelectedEndpointId,
}: {
  endpoints: Endpoint[];
  selectedEndpointId: string;
  setSelectedEndpointId: React.Dispatch<React.SetStateAction<string>>;
}) {
  console.log("Selected endpoint id is:", selectedEndpointId);
  return (
    <div className="flex-column" id="settings-endpoints-list">
      <EndpointCard
        endpoint={{
          id: "automatic",
          name: "Automatic",
          uri: "auto-generated",
        }}
        selectedEndpointId={selectedEndpointId}
        setSelectedEndpointId={setSelectedEndpointId}
        locked={true}
      />
      {endpoints.map((endpoint, index) => (
        <EndpointCard
          key={index}
          endpoint={endpoint}
          selectedEndpointId={selectedEndpointId}
          setSelectedEndpointId={setSelectedEndpointId}
          locked={false}
        />
      ))}
    </div>
  );
}

function EndpointEditor({
  selectedEndpointId,
  endpoints,
  setEndpoints,
}: {
  selectedEndpointId: string;
  endpoints: Endpoint[];
  setEndpoints: React.Dispatch<React.SetStateAction<Endpoint[] | null>>;
}) {
  return (
    <form className="flex-column" id="settings-endpoints-editor">
      <input
        type="text"
        name=""
        className="input-secondary"
        id=""
        placeholder="My Endpoint"
        value={
          endpoints.find((endpoint) => endpoint.id === selectedEndpointId)?.name
        }
      />
      <input
        type="text"
        className="input-secondary"
        placeholder="http://localhost:5001"
        value={
          endpoints.find((endpoint) => endpoint.id === selectedEndpointId)?.uri
        }
      />
      <button type="submit" className="button-secondary">
        Save
      </button>
    </form>
  );
}

function EndpointsSettings({ apiToken }: { apiToken: string }) {
  const [endpoints, setEndpoints] = useState<Endpoint[] | null>(null);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("");

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
          <EndpointsList
            endpoints={endpoints}
            selectedEndpointId={selectedEndpointId}
            setSelectedEndpointId={setSelectedEndpointId}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="flex-column width-fill-max">
        {selectedEndpointId && endpoints ? (
          <EndpointEditor
            selectedEndpointId={selectedEndpointId}
            endpoints={endpoints}
            setEndpoints={setEndpoints}
          />
        ) : (
          <p>No endpoint selected</p>
        )}
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
