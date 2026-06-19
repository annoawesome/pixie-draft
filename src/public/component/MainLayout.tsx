import React, { useEffect, useState } from "react";
import Story, { sortStories } from "../type/storyType";
import AsideSettings from "./AsideSettings";
import Editor from "./Editor";
import Library from "./Library";
import { storiesClient } from "../client/storiesClient";

export default function MainLayout({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    storiesClient
      .loadLibrary()
      .then((stories) => {
        if (stories) {
          setStories(sortStories(stories));
        }
      })
      .catch((error) => {
        // probably failed because unauthroized
        console.error("Error fetching stories:", error);
      });
  }, [authenticated]);

  return (
    <main className="flex-row" id="main-app-layout">
      <Library
        stories={stories}
        selectedStory={selectedStory}
        setSelectedStory={setSelectedStory}
        setStories={setStories}
      />
      <Editor
        selectedStory={selectedStory}
        setSelectedStory={setSelectedStory}
        stories={stories}
        setStories={setStories}
      />
      <AsideSettings
        selectedStory={selectedStory}
        setSelectedStory={setSelectedStory}
        stories={stories}
        setStories={setStories}
      />
    </main>
  );
}
