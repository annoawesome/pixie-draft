import React, { useEffect, useState } from "react";

import { getStories } from "./api/storiesApi";
import Story from "./type/storyType";
import Library from "./component/Library";
import Editor from "./component/Editor";
import AsideSettings from "./component/AsideSettings";
import AuthenticatePrompt from "./component/AuthenticatePrompt";
import { refreshTokens } from "./api/authApi";

export default function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>({
    id: "",
    title: "",
    content: "",
  });

  const [apiToken, setApiToken] = useState<string>("");

  useEffect(() => {
    getStories(apiToken)
      .then((stories) => {
        if (stories) {
          setStories(stories);
        }
      })
      .catch((error) => {
        // probably failed because unauthroized
        console.log(error);
      });
  }, [apiToken]);

  // Refresh api token every 12 minutes, 3 minutes before expiration
  useEffect(() => {
    if (!apiToken) {
      return;
    }

    const timeoutId = setTimeout(
      async () => {
        const newApiToken = await refreshTokens();
        setApiToken(newApiToken);
      },
      1e3 * 60 * 12,
    );

    return () => clearTimeout(timeoutId);
  }, [apiToken]);

  if (apiToken) {
    return (
      <div className="three-column-layout">
        <Library
          stories={stories}
          apiToken={apiToken}
          setSelectedStory={setSelectedStory}
          setStories={setStories}
        />
        <Editor
          apiToken={apiToken}
          selectedStory={selectedStory}
          setSelectedStory={setSelectedStory}
          stories={stories}
          setStories={setStories}
        />
        <AsideSettings
          apiToken={apiToken}
          selectedStory={selectedStory}
          setSelectedStory={setSelectedStory}
          stories={stories}
          setStories={setStories}
        />
      </div>
    );
  } else {
    return <AuthenticatePrompt setApiToken={setApiToken} />;
  }
}
