import jwt from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import { getSecret } from "../init/initializeSecrets.js";

export async function validateAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authCookie = req.signedCookies.authentication;

  if (typeof authCookie !== "string") {
    res.sendStatus(401);
    return;
  }

  jwt.verify(authCookie, getSecret(), (error, decoded) => {
    if (
      decoded &&
      typeof decoded !== "string" &&
      typeof decoded.password === "string"
    ) {
      if (decoded.password === process.env.PIXIE_PASSWORD) {
        next();
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  });
}
