import express from "express";
import getStoryFromId from "../dao/stories/getStoryFromIdDao.js";
import getStoriesPreview from "../dao/stories/getStoriesPreviewDao.js";
import createStory from "../dao/stories/createStoryDao.js";
import updateStory from "../dao/stories/updateStoryDao.js";
import deleteStory from "../dao/stories/deleteStoryDao.js";
import { validateAuthentication } from "../middleware/authMiddleware.js";
import Story, { StorySchema } from "../type/storyType.js";

const router = express.Router();

router.use(validateAuthentication);

router.get("/", async (req, res) => {
  try {
    const stories = await getStoriesPreview();
    res.json(stories);
  } catch (error) {
    console.error("Error fetching stories preview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const story = await getStoryFromId(id);

    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ error: "Story not found" });
    }
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", (req, res) => {
  const { title, content, history, historyIndex } = req.body;

  try {
    const story = createStory(title, content, history, historyIndex);
    res.status(201).json(story);
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const story: Story = StorySchema.parse({ id, ...req.body });

    updateStory(story);
    res.status(204).send();
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  try {
    deleteStory(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
