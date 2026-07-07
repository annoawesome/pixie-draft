import fs from "fs";

import { Request, Response } from "express";

import HttpStatusCodes from "../util/httpStatusCodes.js";
import { getDatabaseFile } from "../init/initializeDatabase.js";
import checkStoryFileExists from "../dao/stories/checkStoryFileExistsDao.js";
import { downloadService } from "../service/downloadService.js";
import path from "path";

export function getStoriesDownload(req: Request, res: Response) {
  const storiesFileExists = checkStoryFileExists();

  if (storiesFileExists) {
    const downloadId = downloadService.addDownloadId(
      getDatabaseFile("stories.json"),
    );

    res.send(`/download/${downloadId}`);
  } else {
    res.sendStatus(HttpStatusCodes.NOT_FOUND);
  }
}

export function postStoriesUpload(req: Request, res: Response) {
  const fileName = "stories.json";
  const writeStream = fs.createWriteStream(
    path.resolve(getDatabaseFile(fileName)),
  );

  req.pipe(writeStream);

  writeStream.on("finish", () => {
    res.sendStatus(HttpStatusCodes.CREATED);
  });

  writeStream.on("error", () => {
    res.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });
}
