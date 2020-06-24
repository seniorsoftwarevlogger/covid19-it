const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);
app.get("/sunburst", (req, res) =>
  res.sendFile(path.join(__dirname, "public/sunburst.html"))
);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
