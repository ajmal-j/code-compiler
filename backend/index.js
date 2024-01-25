import express from "express";
import { node } from "compile-run";
import fs from "fs";
import path from "path";

const app = express();

app.get("/", async (req, res) => {
  try {
    let __dirname = path.resolve(path.dirname(""));
    const filePath = path.join(__dirname, "code.js");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    let result = await node.runSource(fileContent);
    if (result.stderr) {
      const errorMessage = result.stderr.split("\n").slice(1).join(",");
      res.send(errorMessage);
    } else {
      res.send(result.stdout);
    }
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
