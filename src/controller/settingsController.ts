import { Request, Response } from "express";
import fetchUserSettings from "../dao/settings/fetchUserSettingsDao.js";
import updateUserSettings from "../dao/settings/updateUserSettingsDao.js";
import patchUserSettings from "../dao/settings/patchUserSettingsDao.js";
import { UpdateUserSettingDto } from "../type/settingType.js";
import HttpStatusCodes from "../util/httpStatusCodes.js";

export function getSettings(req: Request, res: Response) {
  try {
    const settings = fetchUserSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export function updateSettings(req: Request, res: Response) {
  try {
    const settings = req.body;
    updateUserSettings(settings);
    res.sendStatus(HttpStatusCodes.OK);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export function patchSettings(req: Request, res: Response) {
  try {
    const rawSettingName = req.params.setting;
    const { setting, content } = UpdateUserSettingDto.parse({
      setting: rawSettingName,
      content: req.body,
    });

    if (setting === "endpoints") {
      patchUserSettings(setting, content);
      res.sendStatus(HttpStatusCodes.OK);
    } else {
      res.sendStatus(HttpStatusCodes.BAD_REQUEST);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
