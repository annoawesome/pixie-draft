import fs from "fs";
import path from "path";

import express from "express";

import HttpStatusCodes from "../util/httpStatusCodes.js";
import { downloadService } from "../service/downloadService.js";

const router = express.Router();

router.get("/:id", (req, res) => {
  const filePath = downloadService.getFilePath(req.params.id);

  if (filePath) {
    res.setHeader("Content-Disposition", 'attachment; filename="stories.json"');

    fs.createReadStream(path.resolve(filePath)).pipe(res);
  } else {
    res.sendStatus(HttpStatusCodes.NOT_FOUND);
  }
});

export default router;
