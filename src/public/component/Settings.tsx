import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../api/settingsApi";

interface Endpoint {
  id: string;
  name: string;
  uri: string;
}

function EndpointCard({
  endpoint,
  selectedEndpoint,
  setSelectedEndpoint,
  locked,
}: {
  endpoint: Endpoint;
  selectedEndpoint: Endpoint | null;
  setSelectedEndpoint: React.Dispatch<React.SetStateAction<Endpoint | null>>;
  locked: boolean;
}) {
  return (
    <button
      className="button-secondary"
      disabled={locked}
      id={
        endpoint.id === selectedEndpoint?.id
          ? "settings-selected-endpoint-card"
          : undefined
      }
      onClick={() => setSelectedEndpoint(endpoint)}
    >
      <h2>{endpoint.name}</h2>
      <p>{endpoint.uri}</p>
    </button>
  );
}

function EndpointsList({
  endpoints,
  selectedEndpoint,
  setSelectedEndpoint,
}: {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  setSelectedEndpoint: React.Dispatch<React.SetStateAction<Endpoint | null>>;
}) {
  console.log("Selected endpoint is:", selectedEndpoint);
  return (
    <div className="flex-column" id="settings-endpoints-list">
      <EndpointCard
        endpoint={{
          id: "automatic",
          name: "Automatic",
          uri: "auto-generated",
        }}
        selectedEndpoint={selectedEndpoint}
        setSelectedEndpoint={setSelectedEndpoint}
        locked={true}
      />
      {endpoints.map((endpoint, index) => (
        <EndpointCard
          key={index}
          endpoint={endpoint}
          selectedEndpoint={selectedEndpoint}
          setSelectedEndpoint={setSelectedEndpoint}
          locked={false}
        />
      ))}
    </div>
  );
}

function EndpointEditor({
  apiToken,
  selectedEndpoint,
  endpoints,
  setSelectedEndpoint,
  setEndpoints,
}: {
  apiToken: string;
  selectedEndpoint: Endpoint;
  endpoints: Endpoint[];
  setSelectedEndpoint: React.Dispatch<React.SetStateAction<Endpoint | null>>;
  setEndpoints: React.Dispatch<React.SetStateAction<Endpoint[] | null>>;
}) {
  const onSubmitEndpointsEditor = (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const { name, uri } = Object.fromEntries(new FormData(event.target));

    if (typeof name === "string" && typeof uri === "string") {
      const updatedEndpoints = endpoints.map((endpoint) => {
        if (endpoint.id === selectedEndpoint.id) {
          return {
            ...selectedEndpoint,
          };
        }

        return endpoint;
      });

      setEndpoints(updatedEndpoints);

      // TODO: make this into a patch based system instead
      updateSettings(apiToken, {
        endpoints: updatedEndpoints,
      });
    } else {
      alert("Somehow, what you put in wasn't a string. Try again.");
    }
  };

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEndpoint({
      ...selectedEndpoint,
      name: event.target.value,
    });
  };

  const onChangeUri = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEndpoint({
      ...selectedEndpoint,
      uri: event.target.value,
    });
  };

  return (
    <form
      className="flex-column"
      id="settings-endpoints-editor"
      onSubmit={onSubmitEndpointsEditor}
    >
      <input
        type="text"
        name="name"
        className="input-secondary"
        id=""
        placeholder="My Endpoint"
        value={selectedEndpoint.name}
        onChange={onChangeName}
      />
      <input
        type="text"
        name="uri"
        className="input-secondary"
        placeholder="http://localhost:5001"
        value={selectedEndpoint.uri}
        onChange={onChangeUri}
      />
      <button type="submit" className="button-secondary">
        Save
      </button>
    </form>
  );
}

function EndpointsSettings({ apiToken }: { apiToken: string }) {
  const [endpoints, setEndpoints] = useState<Endpoint[] | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null,
  );

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
            selectedEndpoint={selectedEndpoint}
            setSelectedEndpoint={setSelectedEndpoint}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="flex-column width-fill-max">
        {selectedEndpoint && endpoints ? (
          <EndpointEditor
            apiToken={apiToken}
            selectedEndpoint={selectedEndpoint}
            endpoints={endpoints}
            setSelectedEndpoint={setSelectedEndpoint}
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
