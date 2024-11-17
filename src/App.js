import logo from './logo.svg';
import React, { useState } from "react";
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);

  // Update cell value
  const handleCellChange = (e, rowIndex, key) => {
    const newTransactions = [...transactions];
    newTransactions[rowIndex][key] = e.target.value;
    setTransactions(newTransactions);
  };

  // Add a new empty row
  const handleAddRow = () => {
    setTransactions([
      ...transactions,
      {
        token_bought_amount: "",
        token_sold_amount: "",
        token_bought_symbol: "",
        token_sold_symbol: "",
        block_number: "",
        amount_usd: "",
        token_bought_address: "",
        token_sold_address: "",
        trade_id: "",
      },
    ]);
  };

  // Delete a row
  const handleDeleteRow = (rowIndex) => {
    const newTransactions = transactions.filter((_, index) => index !== rowIndex);
    setTransactions(newTransactions);
  };

  return (
    <div style={{ padding: "20px", background: "#fdf2e9", borderRadius: "8px" }}>
      <h3>Transaction Data</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Token Bought Amount</th>
            <th>Token Sold Amount</th>
            <th>Token Bought Symbol</th>
            <th>Token Sold Symbol</th>
            <th>Block Number</th>
            <th>Amount USD</th>
            <th>Token Bought Address</th>
            <th>Token Sold Address</th>
            <th>Trade ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(transaction).map((key, cellIndex) => (
                <td key={cellIndex}>
                  <input
                    type="text"
                    value={transaction[key]}
                    onChange={(e) => handleCellChange(e, rowIndex, key)}
                    style={{
                      width: "100%",
                      padding: "5px",
                      boxSizing: "border-box",
                    }}
                  />
                </td>
              ))}
              <td>
                <button
                  onClick={() => handleDeleteRow(rowIndex)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddRow}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          background: "#ffa726",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add +
      </button>
    </div>
  );
};

export default App;
