import express from "express";

import { validateAuthentication } from "../middleware/authMiddleware.js";
import * as settingsController from "../controller/settingsController.js";

const router = express.Router();
// router.use(validateAuthentication);

router.get("/", settingsController.getSettings);
router.put("/", settingsController.updateSettings);
router.patch("/:setting", settingsController.patchSettings);

export default router;
