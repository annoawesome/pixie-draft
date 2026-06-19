import { Request, Response } from "express";
import fetchUserSettings from "../dao/settings/fetchUserSettingsDao.js";
import updateUserSettings from "../dao/settings/updateUserSettingsDao.js";
import patchUserSettings from "../dao/settings/patchUserSettingsDao.js";
import { UpdateUserSettingDto } from "../type/settingType.js";

export function getSettings(req: Request, res: Response) {
  try {
    const settings = fetchUserSettings();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export function updateSettings(req: Request, res: Response) {
  try {
    const settings = req.body;
    updateUserSettings(settings);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
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
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
