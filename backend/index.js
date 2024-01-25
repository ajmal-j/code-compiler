import express from "express";
import { node, cpp, c, java, python } from "compile-run";
import fs from "fs";
import path from "path";

const app = express();

app.get("/", async (req, res) => {
  const language = req.query.l;
  if (!language) return res.end("select a language");
  try {
    let selectedExtension =
      language.toLowerCase() === "node"
        ? ".js"
        : language.toLowerCase() === "cpp"
        ? ".cpp"
        : language.toLowerCase() === "c"
        ? ".c"
        : language.toLowerCase() === "java"
        ? ".java"
        : ".py";

    let __dirname = path.resolve(path.dirname(""));
    const filePath = path.join(__dirname, `code${selectedExtension}`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    let selectedLanguage =
      language.toLowerCase() === "node"
        ? node
        : language.toLowerCase() === "cpp"
        ? cpp
        : language.toLowerCase() === "c"
        ? c
        : language.toLowerCase() === "java"
        ? java
        : python;
    let result = await selectedLanguage.runSource(fileContent);
    if (result.stderr) {
      const errorMessage = result.stderr.split("\n").slice(1).join(",");
      res.send(errorMessage);
    } else {
      console.log(result);
      res.send(result.stdout);
    }
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
