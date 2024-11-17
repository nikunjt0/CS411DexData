import React, { useState } from "react";
import "./App.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function App() {
  const [transactions, setTransactions] = useState([]);

  // Update cell value
  const handleCellChange = (e, rowIndex, key) => {
    const newTransactions = [...transactions];
    newTransactions[rowIndex][key] = e.target.value;
    setTransactions(newTransactions);
  };

  // Add a new empty row with default date and time fields
  const handleAddRow = () => {
    const now = new Date();
    setTransactions([
      ...transactions,
      {
        blockchain: "",
        project: "",
        version: "",
        block_month: now.toLocaleString("default", { month: "long" }), // e.g., "November"
        block_date: now.getDate(), // e.g., 17
        block_time: now.toTimeString().split(" ")[0], // e.g., "14:23:45"
        block_number: "",
        token_bought_symbol: "",
        token_sold_symbol: "",
        token_pair: "",
        token_bought_amount: "",
        token_sold_amount: "",
        token_bought_amount_raw: "",
        token_sold_amount_raw: "",
        amount_usd: "",
        token_bought_address: "",
        token_sold_address: "",
        taker: "",
        maker: "",
        project_contract_address: "",
        tx_hash: "",
        tx_from: "",
        tx_to: "",
        evt_index: "",
      },
    ]);
  };

  // Delete a row
  const handleDeleteRow = (rowIndex) => {
    const newTransactions = transactions.filter((_, index) => index !== rowIndex);
    setTransactions(newTransactions);
  };

  // Filter transactions for valid rows with required data
  const validTransactions = transactions.filter(
    (tx) =>
      tx.token_bought_symbol &&
      tx.amount_usd &&
      tx.block_month &&
      tx.block_date &&
      tx.block_time &&
      !isNaN(Number(tx.amount_usd)) // Ensure amount_usd is a valid number
  );

  // Group transactions by token_bought_symbol for the chart
  const groupedData = validTransactions.reduce((acc, tx) => {
    const { token_bought_symbol, amount_usd, block_month, block_date, block_time } = tx;
    const label = `${block_month} ${block_date} ${block_time}`; // Combine month, date, and time for X-axis
    if (!acc[token_bought_symbol]) {
      acc[token_bought_symbol] = [];
    }
    acc[token_bought_symbol].push({
      label,
      amount_usd: Number(amount_usd),
    });
    return acc;
  }, {});

  // Convert grouped data into an array format suitable for Recharts
  const chartData = Object.keys(groupedData).map((token) => ({
    token,
    data: groupedData[token],
  }));

  return (
    <div className="app-container">
      {/* Left-hand section: DEX Market Data */}
      <div className="left-section">
        <h3>Latest DEX Market Data</h3>
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer>
            <LineChart>
              <XAxis
                dataKey="label"
                type="category"
                tick={{ fontSize: 12 }}
                label={{ value: "Date and Time", position: "insideBottom", fontSize: 14 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                label={{ value: "Amount (USD)", angle: -90, position: "insideLeft", fontSize: 14 }}
              />
              <Tooltip formatter={(value, name) => [`$${value}`, name]} />
              <Legend />
              {chartData.map((tokenData, index) => (
                <Line
                  key={tokenData.token}
                  dataKey="amount_usd"
                  data={tokenData.data}
                  name={tokenData.token}
                  type="monotone"
                  stroke={`hsl(${index * 60}, 70%, 50%)`} // Assign a unique color to each token
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right-hand transaction table */}
      <div className="transaction-table-container">
        <h3>Transaction Data</h3>
        <table>
          <thead>
            <tr>
              <th>Blockchain</th>
              <th>Project</th>
              <th>Version</th>
              <th>Block Month</th>
              <th>Block Date</th>
              <th>Block Time</th>
              <th>Block Number</th>
              <th>Token Bought Symbol</th>
              <th>Token Sold Symbol</th>
              <th>Token Pair</th>
              <th>Token Bought Amount</th>
              <th>Token Sold Amount</th>
              <th>Token Bought Amount Raw</th>
              <th>Token Sold Amount Raw</th>
              <th>Amount USD</th>
              <th>Token Bought Address</th>
              <th>Token Sold Address</th>
              <th>Taker</th>
              <th>Maker</th>
              <th>Project Contract Address</th>
              <th>Tx Hash</th>
              <th>Tx From</th>
              <th>Tx To</th>
              <th>Evt Index</th>
              <th>Delete</th>
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
                    />
                  </td>
                ))}
                <td>
                  <button onClick={() => handleDeleteRow(rowIndex)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddRow} className="add-button">
          Add +
        </button>
      </div>
    </div>
  );
}

export default App;
