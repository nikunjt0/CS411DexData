const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// MySQL Database Connection
const db = mysql.createConnection({
  host: "34.67.152.59", // Replace with your GCP MySQL instance Public IP
  user: "root",      // Replace with your database username
  password: "blockchain",  // Replace with your database password
  database: "Crypto",       // Replace with your database name
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit if the connection fails
  } else {
    console.log("Connected to the MySQL database on GCP.");
  }
});

/// Endpoint to fetch all trades
app.get("/api/trades", (req, res) => {
    const query = "SELECT * FROM Trades"; // Query the `Trades` table
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching trades:", err);
        res.status(500).json({ error: "Failed to fetch trades" });
      } else {
        res.json(results); // Send results as JSON response
      }
    });
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

// 2. Add a new transaction
app.post("/api/transactions", (req, res) => {
  const transaction = req.body; // Ensure the request body contains transaction details
  const query = "INSERT INTO transactions SET ?";
  db.query(query, transaction, (err, result) => {
    if (err) {
      console.error("Error adding transaction:", err);
      res.status(500).json({ error: "Failed to add transaction" });
    } else {
      res.status(201).json({ id: result.insertId });
    }
  });
});

// 3. Update an existing transaction
app.put("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const updatedTransaction = req.body;
  const query = "UPDATE transactions SET ? WHERE id = ?";
  db.query(query, [updatedTransaction, id], (err) => {
    if (err) {
      console.error("Error updating transaction:", err);
      res.status(500).json({ error: "Failed to update transaction" });
    } else {
      res.sendStatus(200);
    }
  });
});

// 4. Delete a transaction
app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM transactions WHERE id = ?";
  db.query(query, id, (err) => {
    if (err) {
      console.error("Error deleting transaction:", err);
      res.status(500).json({ error: "Failed to delete transaction" });
    } else {
      res.sendStatus(200);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
