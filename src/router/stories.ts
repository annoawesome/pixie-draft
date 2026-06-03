import express from "express";
import getStoryFromId from "../dao/getStoryFromId.js";
import getStoriesPreview from "../dao/getStoriesPreview.js";

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

export default router;
