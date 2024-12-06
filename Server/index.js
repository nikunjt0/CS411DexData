const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5001;

// Middleware
const compression = require("compression");
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// MySQL Database Connection
const db = mysql.createConnection({
  host: "34.67.152.59", // Replace with your GCP MySQL instance Public IP
  user: "root",      // Replace with your database username
  password: "thebestgroup",  // Replace with your database password
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
  console.log("call recognized");
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching trades:", err);
      res.status(500).json({ error: "Failed to fetch trades" });
    } else {
      console.log("successfully found data");
      res.json(results); // Send results as JSON response
    }
  });
});

app.put("/api/trades", (req, res) => {
  const transactions = req.body;

  if (!Array.isArray(transactions)) {
    return res.status(400).json({ error: "Invalid input format. Expected an array." });
  }

  const promises = transactions.map((transaction) => {
    const { tx_hash, evt_index, isDeleted, ...data } = transaction;

    if (!tx_hash || evt_index == null) {
      console.error("Transaction is missing tx_hash or evt_index:", transaction);
      return Promise.reject(new Error("Transaction is missing tx_hash or evt_index"));
    }

    if (isDeleted) {
      // Handle deletion
      const deleteQuery = "DELETE FROM Trades WHERE tx_hash = ? AND evt_index = ?";
      return new Promise((resolve, reject) => {
        db.query(deleteQuery, [tx_hash, evt_index], (err, result) => {
          if (err) {
            console.error(
              `Failed to delete transaction with tx_hash ${tx_hash} and evt_index ${evt_index}:`,
              err
            );
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } else {
      // Handle upsert
      const sanitizedData = { ...data };
      Object.keys(sanitizedData).forEach((key) => {
        if (
          [
            "version",
            "block_number",
            "token_bought_amount",
            "token_sold_amount",
            "token_bought_amount_raw",
            "token_sold_amount_raw",
            "amount_usd",
            "evt_index",
          ].includes(key)
        ) {
          sanitizedData[key] =
            sanitizedData[key] === "" || sanitizedData[key] === null
              ? null
              : sanitizedData[key];
        }
      });

      const dataWithKeys = { tx_hash, evt_index, ...sanitizedData };

      const upsertQuery = "INSERT INTO Trades SET ? ON DUPLICATE KEY UPDATE ?";

      return new Promise((resolve, reject) => {
        db.query(upsertQuery, [dataWithKeys, sanitizedData], (err, result) => {
          if (err) {
            console.error(
              `Failed to upsert transaction with tx_hash ${tx_hash} and evt_index ${evt_index}:`,
              err
            );
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ message: "All transactions processed successfully." });
    })
    .catch((error) => {
      console.error("Error processing transactions:", error);
      res.status(500).json({ error: "Failed to process transactions." });
    });
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
  console.log("id");
  const query = "DELETE FROM transactions WHERE id = ?";
  db.query(query, id, (err) => {
    if (err) {
      console.error("Error deleting transaction:", err);
      res.status(500).json({ error: "Failed to delete transaction" });
    } else {
      console.log("delete worked properly");
      res.sendStatus(200);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
