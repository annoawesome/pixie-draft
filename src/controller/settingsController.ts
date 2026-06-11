import { Request, Response } from "express";
import fetchUserSettings from "../dao/settings/fetchUserSettings.js";
import updateUserSettings from "../dao/settings/updateUserSettings.js";

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
  res.sendStatus(501);
}
