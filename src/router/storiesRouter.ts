import express from "express";
import getStoryFromId from "../dao/stories/getStoryFromIdDao.js";
import getStoriesPreview from "../dao/stories/getStoriesPreviewDao.js";
import createStory from "../dao/stories/createStoryDao.js";
import updateStory from "../dao/stories/updateStoryDao.js";
import deleteStory from "../dao/stories/deleteStoryDao.js";
import { validateAuthentication } from "../middleware/authMiddleware.js";
import Story, {
  StoryCreateDto,
  StoryCreateDtoSchema,
  StorySchema,
} from "../type/storyType.js";
import {
  getStoriesDownload,
  postStoriesUpload,
} from "../controller/storiesController.js";
import HttpStatusCodes from "../util/httpStatusCodes.js";

const router = express.Router();

router.use(validateAuthentication);

router.get("/", async (req, res) => {
  try {
    const stories = await getStoriesPreview();
    res.json(stories);
  } catch (error) {
    console.error("Error fetching stories preview:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

router.get("/download", getStoriesDownload);

router.post("/upload", postStoriesUpload);

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const story = await getStoryFromId(id);

    if (story) {
      res.json(story);
    } else {
      res.status(HttpStatusCodes.NOT_FOUND).json({ error: "Story not found" });
    }
  } catch (error) {
    console.error("Error fetching story:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

router.post("/", (req, res) => {
  const storyCreateDto: StoryCreateDto = StoryCreateDtoSchema.parse(req.body);
  const { title, content, history, historyIndex } = storyCreateDto;

  try {
    const story = createStory(title, content, history, historyIndex);
    res.status(HttpStatusCodes.CREATED).json(story);
  } catch (error) {
    console.error("Error creating story:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const story: Story = StorySchema.parse({ id, ...req.body });
    story.time.modified = Date.now();

    updateStory(story);
    res.status(HttpStatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error("Error updating story:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  try {
    deleteStory(id);
    res.status(HttpStatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error("Error deleting story:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
});

export default router;
