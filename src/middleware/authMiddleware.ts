import jwt from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import { getSecret } from "../init/initializeSecrets.js";
import HttpStatusCodes from "../util/httpStatusCodes.js";

export async function validateAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
    return;
  }

  const token = authorization.substring(7);

  jwt.verify(token, getSecret(), (error) => {
    if (!error) {
      next();
    } else {
      res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
    }
  });
}
