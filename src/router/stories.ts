import express from "express";
import getStoryFromId from "../dao/getStoryFromId.js";
import getStoriesPreview from "../dao/getStoriesPreview.js";
import createStory from "../dao/createStory.js";
import updateStory from "../dao/updateStory.js";
import deleteStory from "../dao/deleteStory.js";

const router = express.Router();

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
  console.log("Body:", req.body);

  const { title, content } = req.body;

  try {
    const story = createStory(title, content);
    res.status(201).json(story);
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    updateStory(id, title, content);
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
