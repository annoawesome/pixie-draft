import React, { useEffect, useState } from "react";

import { getStories } from "./api/storiesApi";
import Story from "./type/storyType";
import Library from "./component/Library";
import Editor from "./component/Editor";
import AsideSettings from "./component/AsideSettings";
import AuthenticatePrompt from "./component/AuthenticatePrompt";

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
          if (stories.length > 0) {
            setSelectedStory(stories[0]);
          }
          setStories(stories);
        }
      })
      .catch((error) => {
        // probably failed because unauthroized
        console.log(error);
      });
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
