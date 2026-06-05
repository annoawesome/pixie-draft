import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const { password }: { password: string } = req.body;

  if (password === process.env.PIXIE_PASSWORD) {
    // give them some kind of authentication cookie
  }

  res.sendStatus(501);
});

router.post("/refresh", (req, res) => {
  const { password }: { password: string } = req.body;

  if (password === process.env.PIXIE_PASSWORD) {
    // give them some kind of authentication cookie
  }

  res.sendStatus(501);
});

export default router;
