import React, { useEffect } from "react";

type Story = {
  id: string;
  title: string;
  content: string;
};

function StoryCard({
  story,
  setSelectedStory,
}: {
  story: Story;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
}) {
  return (
    <button
      className="story-card"
      onClick={() => {
        const id = story.id;

        loadStory(id).then((fullStory) => {
          console.log("Loaded story:", fullStory);

          setSelectedStory(fullStory);
        });
      }}
    >
      <h2>{story.title}</h2>
    </button>
  );
}

function Library({
  stories,
  setSelectedStory,
  setStories,
}: {
  stories: Story[];
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  return (
    <div id="library">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          setSelectedStory={setSelectedStory}
        />
      ))}
      <button
        id="new-story-button"
        onClick={() => {
          createStory("New Story", "Once upon a time...").then((newStory) => {
            setSelectedStory(newStory);
            setStories((prev) => [...prev, newStory]);
          });
        }}
      >
        New Story
      </button>
    </div>
  );
}

function Editor({
  selectedStory,
  stories,
  setSelectedStory,
  setStories,
}: {
  selectedStory: Story | null;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  return (
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
        onBlur={() => {
          if (selectedStory) {
            saveStory(selectedStory);
            setStories(updateStoriesFromUpdatedStory(stories, selectedStory));
          }
        }}
      />
      <textarea
        id="story-content"
        placeholder="Write your story here..."
        value={selectedStory?.content || ""}
        onChange={(e) => {
          const mutatedStory = selectedStory
            ? mutateStoryContent(selectedStory, e.target.value)
            : null;

          setSelectedStory(mutatedStory);
        }}
        onBlur={() => {
          if (selectedStory) {
            saveStory(selectedStory);
          }
        }}
      />
    </div>
  );
}

function AsideSettings({
  selectedStory,
  setSelectedStory,
  stories,
  setStories,
}: {
  selectedStory: Story | null;
  setSelectedStory: React.Dispatch<React.SetStateAction<Story | null>>;
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  return (
    <aside id="aside-settings">
      <button
        onClick={() => {
          if (selectedStory) {
            deleteStory(selectedStory.id);
            setStories(removeStoryFromStories(stories, selectedStory));
            setSelectedStory(null);
          }
        }}
      >
        Delete
      </button>
    </aside>
  );
}

async function getStories(): Promise<Story[]> {
  const response = await fetch("/api/v0/stories");

  try {
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching stories:", error);
  }

  return [];
}

async function createStory(title: string, content: string): Promise<Story> {
  const response = await fetch("/api/v0/stories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  try {
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating story:", error);
  }

  return { id: "", title, content };
}

async function saveStory(story: Story) {
  const response = await fetch(`/api/v0/stories/${story.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(story),
  });

  return response.ok;
}

async function loadStory(id: string): Promise<Story> {
  const response = await fetch(`/api/v0/stories/${id}`);
  return response.json();
}

async function deleteStory(id: string) {
  const response = await fetch(`/api/v0/stories/${id}`, {
    method: "DELETE",
  });

  return response.ok;
}

function mutateStoryTitle(story: Story, newTitle: string) {
  return { ...story, title: newTitle };
}

function mutateStoryContent(story: Story, newContent: string) {
  return { ...story, content: newContent };
}

// offline helper function that updates the story contained in stories to save a bit of bandwidth
function updateStoriesFromUpdatedStory(stories: Story[], updatedStory: Story) {
  return stories.map((story) =>
    story.id === updatedStory.id ? updatedStory : story,
  );
}

// offline helper function that removes the story contained in stories
function removeStoryFromStories(stories: Story[], storyToRemove: Story) {
  return stories.filter((story) => story.id !== storyToRemove.id);
}

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
