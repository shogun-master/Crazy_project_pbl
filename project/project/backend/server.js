const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // use your MySQL password
  database: "bbk_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

// GET all entries
app.get("/api/data", (req, res) => {
  db.query("SELECT * FROM entries", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST a new entry
app.post("/api/data", (req, res) => {
  const { name, message } = req.body;
  db.query(
    "INSERT INTO entries (name, message) VALUES (?, ?)",
    [name, message],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, name, message });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
