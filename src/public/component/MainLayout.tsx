import React, { useEffect, useState } from "react";
import Story from "../type/storyType";
import * as storiesService from "../service/storiesService";
import AsideSettings from "./AsideSettings";
import Editor from "./Editor";
import Library from "./Library";
import { storiesClient } from "../client/storiesClient";

export default function MainLayout({
  authenticated,
  zenMode,
}: {
  authenticated: boolean;
  zenMode: boolean;
}) {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    storiesClient
      .loadLibrary()
      .then((stories) => {
        if (stories) {
          setStories(storiesService.sortStories(stories));
        }
      })
      .catch((error) => {
        // probably failed because unauthroized
        console.error("Error fetching stories:", error);
      });
  }, [authenticated]);

  return (
    <main className="flex-row" id="main-app-layout">
      {zenMode ? (
        <div className="flex-column side-column scrollable" id="library"></div>
      ) : (
        <Library
          stories={stories}
          selectedStory={selectedStory}
          setSelectedStory={setSelectedStory}
          setStories={setStories}
        />
      )}
      <Editor
        selectedStory={selectedStory}
        setSelectedStory={setSelectedStory}
        stories={stories}
        setStories={setStories}
      />
      {zenMode ? (
        <aside
          className="flex-column side-column scrollable"
          id="aside-settings"
        ></aside>
      ) : (
        <AsideSettings
          selectedStory={selectedStory}
          setSelectedStory={setSelectedStory}
          stories={stories}
          setStories={setStories}
        />
      )}
    </main>
  );
}
