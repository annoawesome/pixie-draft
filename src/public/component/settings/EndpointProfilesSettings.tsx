import React, { useEffect, useState } from "react";

import Endpoint from "../../type/endpointType";
import { settingsClient } from "../../client/settingsClient";

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
  const onClickEndpointCard = () => setSelectedEndpoint(endpoint);

  return (
    <button
      className={
        "button-secondary " +
        (selectedEndpoint?.id === endpoint.id ? "button-selected" : "")
      }
      disabled={locked}
      onClick={onClickEndpointCard}
    >
      <h2>{endpoint.name}</h2>
      <p>{endpoint.uri}</p>
    </button>
  );
}

function EndpointsList({
  endpoints,
  selectedEndpoint,
  setEndpoints,
  setSelectedEndpoint,
}: {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  setEndpoints: React.Dispatch<React.SetStateAction<Endpoint[] | null>>;
  setSelectedEndpoint: React.Dispatch<React.SetStateAction<Endpoint | null>>;
}) {
  console.log("Selected endpoint is:", selectedEndpoint);
  const onClickCreateNewProfile = () => {
    const updatedEndpoints = [
      ...endpoints,
      {
        id: crypto.randomUUID(),
        name: "My Endpoint",
        type: "KoboldCpp",
        uri: "http://example.com",
        authorization: "",
      },
    ];

    setEndpoints(updatedEndpoints);
    settingsClient.updateSetting("endpoints", updatedEndpoints);
  };

  return (
    <div className="flex-column scrollable" id="settings-endpoints-list">
      <button
        type="button"
        className="button-secondary"
        onClick={onClickCreateNewProfile}
      >
        Create new profile
      </button>
      <EndpointCard
        endpoint={{
          id: "automatic",
          name: "Automatic",
          type: "KoboldCpp",
          uri: "auto-generated",
          authorization: "",
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
  selectedEndpoint,
  endpoints,
  setSelectedEndpoint,
  setEndpoints,
}: {
  selectedEndpoint: Endpoint;
  endpoints: Endpoint[];
  setSelectedEndpoint: React.Dispatch<React.SetStateAction<Endpoint | null>>;
  setEndpoints: React.Dispatch<React.SetStateAction<Endpoint[] | null>>;
}) {
  const onSubmitEndpointsEditor = (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const { name, uri, authorization } = Object.fromEntries(
      new FormData(event.target),
    );

    if (
      typeof name === "string" &&
      typeof uri === "string" &&
      typeof authorization === "string"
    ) {
      const updatedEndpoints = endpoints.map((endpoint) => {
        if (endpoint.id === selectedEndpoint.id) {
          return {
            ...selectedEndpoint,
          };
        }

        return endpoint;
      });

      setEndpoints(updatedEndpoints);

      settingsClient.updateSetting("endpoints", updatedEndpoints);
    } else {
      alert("Somehow, what you put in wasn't a string. Try again.");
    }
  };

  const onClickDelete = () => {
    const updatedEndpoints = endpoints.filter(
      (endpoint) => endpoint.id !== selectedEndpoint.id,
    );

    setEndpoints(updatedEndpoints);
    setSelectedEndpoint(null);

    settingsClient.updateSetting("endpoints", updatedEndpoints);
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

  const onChangeAuthorization = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedEndpoint({
      ...selectedEndpoint,
      authorization: event.target.value,
    });
  };

  return (
    <form
      className="flex-column"
      id="settings-endpoints-editor"
      onSubmit={onSubmitEndpointsEditor}
    >
      <label htmlFor="name" className="text-secondary">
        Profile Name
      </label>
      <input
        type="text"
        name="name"
        className="input-secondary"
        id=""
        autoComplete="false"
        placeholder="My Endpoint"
        value={selectedEndpoint.name}
        onChange={onChangeName}
      />
      <label htmlFor="authorization" className="text-secondary">
        Endpoint URI
      </label>
      <input
        type="text"
        name="uri"
        className="input-secondary"
        autoComplete="false"
        placeholder="http://localhost:5001"
        value={selectedEndpoint.uri}
        onChange={onChangeUri}
      />
      <label htmlFor="authorization" className="text-secondary">
        Authorization Key
      </label>
      <input
        type="password"
        name="authorization"
        className="input-secondary"
        autoComplete="false"
        title="Authorization Key"
        placeholder="Authorization key here... (Leave this empty if no authorization is needed)"
        value={selectedEndpoint.authorization}
        onChange={onChangeAuthorization}
      />
      <div className="flex-row" id="settings-endpoints-editor-actions">
        <button type="submit" className="button-primary">
          Save
        </button>
        <button
          type="button"
          className="button-secondary button-destructive"
          onClick={onClickDelete}
        >
          Delete
        </button>
      </div>
    </form>
  );
}

export default function EndpointProfilesSettings() {
  const [endpoints, setEndpoints] = useState<Endpoint[] | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(
    null,
  );

  useEffect(() => {
    settingsClient.getSettings().then((settings) => {
      setEndpoints(settings.endpoints);
    });
  }, []);

  return (
    <div className="flex-row settings-section" id="settings-endpoints-section">
      <div className="width-fill-max flex-column">
        <h1>Endpoints</h1>
        {endpoints ? (
          <EndpointsList
            endpoints={endpoints}
            setEndpoints={setEndpoints}
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
