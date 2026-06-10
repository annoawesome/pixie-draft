import React, { useEffect, useState } from "react";
import Story from "../type/storyType";
import AsideSettings from "./AsideSettings";
import Editor from "./Editor";
import Library from "./Library";
import { getStories } from "../api/storiesApi";

export default function MainLayout({ apiToken }: { apiToken: string }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>({
    id: "",
    title: "",
    content: "",
    history: [
      { content: "", treePrev: -1, attributes: { generatedByLlm: false } },
    ],
    historyIndex: 0,
  });

  useEffect(() => {
    getStories(apiToken)
      .then((stories) => {
        if (stories) {
          setStories(stories);
        }
      })
      .catch((error) => {
        // probably failed because unauthroized
        console.error("Error fetching stories:", error);
      });
  }, [apiToken]);

  return (
    <div className="flex-row" id="main-app-layout">
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
}
