import express from "express";

const port = 8080;

const app = express();

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
