import express from "express";
import jwt from "jsonwebtoken";
import { getSecret } from "../init/initializeSecrets.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { password }: { password: string } = req.body;

  if (password === process.env.PIXIE_PASSWORD) {
    // give them some kind of authentication cookie
    jwt.sign({ password }, getSecret(), { expiresIn: "15m" }, (err, token) => {
      if (token) {
        res.cookie("authentication", token, {
          maxAge: 1e3 * 60 * 15, // 15 minutes
          httpOnly: true,
          signed: true,
          sameSite: "lax",
        });

        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    });

    return;
  }

  res.sendStatus(401);
});

router.post("/refresh", (req, res) => {
  const { password }: { password: string } = req.body;

  if (password === process.env.PIXIE_PASSWORD) {
    // give them some kind of authentication cookie
  }

  res.sendStatus(501);
});

export default router;
