const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());

app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "Nathan 😺" }]);
});

app.listen(3000, "0.0.0.0", () => console.log("✅ Backend running on port 3000"));
