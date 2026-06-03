import React, { useEffect } from "react";

type Story = {
  id: string;
  title: string;
  content: string;
};

function StoryCard({ story }: { story: Story }) {
  return (
    <button className="story-card">
      <h2>{story.title}</h2>
    </button>
  );
}

function Library({ stories }: { stories: Story[] }) {
  return (
    <div id="library">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}

function getStories(): Story[] {
  /* not implemented */
  console.log("Fetching stories...");
  console.log("Not implemented");
  return [];
}

function saveStory(story: Story) {
  /* not implemented */
  console.log("Saving story:", story);
  console.log("Not implemented");
}

// TODO: Load story from backend when selected in library via http/REST API
function loadStory(id: string): Story {
  /* not implemented */
  console.log("Loading story with id:", id);
  console.log("Not implemented");
  return { id, title: "Sample Story", content: "This is a sample story." };
}

function mutateStoryTitle(story: Story, newTitle: string) {
  return { ...story, title: newTitle };
}

function mutateStoryContent(story: Story, newContent: string) {
  return { ...story, content: newContent };
}

export default function App() {
  const [stories, setStories] = React.useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = React.useState<Story | null>({
    id: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchedStories = getStories();
    setStories(fetchedStories);
  }, []);

  return (
    <div className="three-column-layout">
      <Library stories={stories} />
      <div id="editor">
        <input
          type="text"
          id="story-title"
          placeholder="Story Title"
          value={selectedStory?.title}
          onChange={(e) => {
            setSelectedStory((prev) =>
              prev ? mutateStoryTitle(prev, e.target.value) : null,
            );
          }}
        />
        <textarea
          id="story-content"
          placeholder="Write your story here..."
          value={selectedStory?.content || ""}
          onChange={(e) => {
            setSelectedStory((prev) =>
              prev ? mutateStoryContent(prev, e.target.value) : null,
            );
          }}
          onBlur={() => {
            if (selectedStory) {
              saveStory(selectedStory);
            }
          }}
        />
      </div>
    </div>
  );
}
