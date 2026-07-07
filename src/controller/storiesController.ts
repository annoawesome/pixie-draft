import fs from "fs";

import { Request, Response } from "express";

import HttpStatusCodes from "../util/httpStatusCodes.js";
import { getDatabaseFile } from "../init/initializeDatabase.js";
import checkStoryFileExists from "../dao/stories/checkStoryFileExistsDao.js";
import { downloadService } from "../service/downloadService.js";
import path from "path";
import { StoriesSchema } from "../type/storyType.js";

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
    fs.readFile(path.resolve(getDatabaseFile(fileName)), (err, data) => {
      const storiesString = data.toString("utf-8");

      try {
        // we don't need the data, just that it doesn't throw errors if the data matches
        StoriesSchema.parse(JSON.parse(storiesString));

        res.sendStatus(HttpStatusCodes.CREATED);
      } catch {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST);
      }
    });
  });

  writeStream.on("error", () => {
    res.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  });
}
