import React, { useEffect, useState } from "react";
import Story, { StoryPreview } from "../type/storyType";
import * as storiesService from "../service/storiesService";
import AsideSettings from "./AsideSettings";
import Editor from "./Editor";
import Library from "./Library";
import { storiesClient } from "../client/storiesClient";
import CenterPanel from "./CenterPanel";

export default function MainLayout({
  authenticated,
  zenMode,
}: {
  authenticated: boolean;
  zenMode: boolean;
}) {
  const [stories, setStories] = useState<Record<string, Story | StoryPreview>>(
    {},
  );

  useEffect(() => {
    storiesClient
      .loadLibrary()
      .then((stories) => {
        if (stories) {
          setStories(storiesService.convertPreviewsToStories(stories));
        }
      })
      .catch((error) => {
        // probably failed because unauthroized
        console.error("Error fetching stories:", error);
      });
  }, [authenticated]);

  return (
    <main className="" id="main-app-layout">
      {zenMode ? (
        <div className="flex-column side-column scrollable" id="library">
          <CenterPanel className="display-on-mobile div-elevated width-fill-max height-fill-max">
            <p>Zen mode enabled.</p>
          </CenterPanel>
        </div>
      ) : (
        <Library stories={stories} setStories={setStories} />
      )}
      <Editor stories={stories} setStories={setStories} />
      {zenMode ? (
        <aside
          className="flex-column side-column scrollable"
          id="aside-settings"
        >
          <CenterPanel className="display-on-mobile div-elevated width-fill-max height-fill-max">
            <p>Zen mode enabled.</p>
          </CenterPanel>
        </aside>
      ) : (
        <AsideSettings stories={stories} setStories={setStories} />
      )}
    </main>
  );
}
