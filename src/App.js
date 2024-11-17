import logo from './logo.svg';
import React, { useState } from "react";
import './App.css';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

function App() {
  const [transactions, setTransactions] = useState([]);

  // Sample data for the charts
  const graphData = [
    { name: "Jan", uv: 400 },
    { name: "Feb", uv: 300 },
    { name: "Mar", uv: 200 },
    { name: "Apr", uv: 278 },
    { name: "May", uv: 189 },
  ];

  const pieData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* Left Column: Graph and Pie Chart */}
        <div style={{ flex: 1, marginRight: "10px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h4>Graph</h4>
            <LineChart width={300} height={200} data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            </LineChart>
          </div>
          <div>
            <h4>Pie Chart</h4>
            <PieChart width={300} height={200}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>

        {/* Right Column: Table */}
        <div style={{ flex: 2 }}>
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
      </div>
    </div>
  );
}

export default App;