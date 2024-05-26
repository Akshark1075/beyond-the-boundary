const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, "../../client/build")));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
