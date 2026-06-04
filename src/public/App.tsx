import React, { useEffect } from "react";

import { getStories } from "./api/storiesApi";
import Story from "./type/storyType";
import Library from "./component/Library";
import Editor from "./component/Editor";
import AsideSettings from "./component/AsideSettings";

export default function App() {
  const [stories, setStories] = React.useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = React.useState<Story | null>({
    id: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    getStories().then((stories) => {
      if (stories.length > 0) {
        setSelectedStory(stories[0]);
      }

      setStories(stories);
    });
  }, []);

  return (
    <div className="three-column-layout">
      <Library
        stories={stories}
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
    </div>
  );
}
