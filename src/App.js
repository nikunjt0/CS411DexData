import React, { useEffect, useState } from "react";
import Select from "react-select"; // Install react-select: `npm install react-select`
import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]); // For storing selected tokens
  const [allTokens, setAllTokens] = useState([]); // For storing all unique token symbols

  const fieldNames = [
    "blockchain",
    "project",
    "version",
    "block_month",
    "block_date",
    "block_time",
    "block_number",
    "token_bought_symbol",
    "token_sold_symbol",
    "token_pair",
    "token_bought_amount",
    "token_sold_amount",
    "token_bought_amount_raw",
    "token_sold_amount_raw",
    "amount_usd",
    "token_bought_address",
    "token_sold_address",
    "taker",
    "maker",
    "project_contract_address",
    "tx_hash",
    "tx_from",
    "tx_to",
    "evt_index",
  ];

  useEffect(() => {
    const fetchJSON = async () => {
      console.log("Fetching JSON data...");
      try {
        const response = await fetch("http://localhost:5001/api/trades");
        const jsonData = await response.json();

        console.log("JSON data fetched successfully.", jsonData);

        // Process the JSON data and map it to the table structure
        const parsedData = jsonData.map((row) => ({
          blockchain: row.blockchain !== undefined && row.blockchain !== null ? row.blockchain : "",
          project: row.project !== undefined && row.project !== null ? row.project : "",
          version: row.version !== undefined && row.version !== null ? parseInt(row.version, 10) : null,
          block_month: row.block_month !== undefined && row.block_month !== null ? row.block_month : "",
          block_date: row.block_date !== undefined && row.block_date !== null ? row.block_date : "",
          block_time: row.block_time !== undefined && row.block_time !== null ? row.block_time : "",
          block_number: row.block_number !== undefined && row.block_number !== null ? parseInt(row.block_number, 10) : null,
          token_bought_symbol: row.token_bought_symbol !== undefined && row.token_bought_symbol !== null ? row.token_bought_symbol : "",
          token_sold_symbol: row.token_sold_symbol !== undefined && row.token_sold_symbol !== null ? row.token_sold_symbol : "",
          token_pair: row.token_pair !== undefined && row.token_pair !== null ? row.token_pair : "",
          token_bought_amount: row.token_bought_amount !== undefined && row.token_bought_amount !== null ? parseFloat(row.token_bought_amount) : null,
          token_sold_amount: row.token_sold_amount !== undefined && row.token_sold_amount !== null ? parseFloat(row.token_sold_amount) : null,
          token_bought_amount_raw: row.token_bought_amount_raw !== undefined && row.token_bought_amount_raw !== null ? parseFloat(row.token_bought_amount_raw) : null,
          token_sold_amount_raw: row.token_sold_amount_raw !== undefined && row.token_sold_amount_raw !== null ? parseFloat(row.token_sold_amount_raw) : null,
          amount_usd: row.amount_usd !== undefined && row.amount_usd !== null ? parseFloat(row.amount_usd) : null,
          token_bought_address: row.token_bought_address !== undefined && row.token_bought_address !== null ? row.token_bought_address : "",
          token_sold_address: row.token_sold_address !== undefined && row.token_sold_address !== null ? row.token_sold_address : "",
          taker: row.taker !== undefined && row.taker !== null ? row.taker : "",
          maker: row.maker !== undefined && row.maker !== null ? row.maker : "",
          project_contract_address: row.project_contract_address !== undefined && row.project_contract_address !== null ? row.project_contract_address : "",
          tx_hash: row.tx_hash !== undefined && row.tx_hash !== null ? row.tx_hash : null,
          tx_from: row.tx_from !== undefined && row.tx_from !== null ? row.tx_from : "",
          tx_to: row.tx_to !== undefined && row.tx_to !== null ? row.tx_to : "",
          evt_index: row.evt_index !== undefined && row.evt_index !== null ? parseInt(row.evt_index, 10) : null,
        }));            

        console.log("Mapped JSON data to table structure:", parsedData);
        setTransactions(parsedData);

        // Extract unique tokens for the dropdown
        const uniqueTokens = [
          ...new Set(
            parsedData.map((tx) => tx.token_bought_symbol).filter(Boolean)
          ),
        ];
        setAllTokens(uniqueTokens.map((token) => ({ label: token, value: token })));
      } catch (error) {
        console.error("Error fetching JSON data:", error);
      }
    };

    fetchJSON();
  }, []);

  // Update cell value
  const handleCellChange = (e, rowIndex, key) => {
    setTransactions((prevTransactions) => {
      const updatedTransactions = [...prevTransactions];
      const updatedRow = { ...updatedTransactions[rowIndex] };
  
      // Update the specific field based on its type
      if (["evt_index", "version", "block_number"].includes(key)) {
        updatedRow[key] = e.target.value === "" ? null : parseInt(e.target.value, 10);
      } else if (
        [
          "token_bought_amount",
          "token_sold_amount",
          "token_bought_amount_raw",
          "token_sold_amount_raw",
          "amount_usd",
        ].includes(key)
      ) {
        updatedRow[key] = e.target.value === "" ? null : parseFloat(e.target.value);
      } else {
        updatedRow[key] = e.target.value;
      }
  
      updatedTransactions[rowIndex] = updatedRow;
      return updatedTransactions;
    });
  };
  

  useEffect(() => {
    console.log("Updated Transactions:");
    console.log(transactions);
  }, [transactions]);
  
  

  // Add a new empty row
  const handleAddRow = () => {
    const now = new Date();
    const newRow = {
      blockchain: "",
      project: "",
      version: "",
      block_month: "2024-11-01 0:00",
      block_date: "2024-11-18 0:00",
      block_time: "2024-11-18" + now.toTimeString().split(" ")[0],
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
    };

    // Prepend the new row to the transactions array
    setTransactions([newRow, ...transactions]);
  };

  // Delete a row
  const handleDeleteRow = (rowIndex) => {
    const newTransactions = transactions.filter((_, index) => index !== rowIndex);
    setTransactions(newTransactions);
  };

  const handleUpdate = async () => {
    console.log(transactions);
  
    try {
      const response = await fetch("http://localhost:5001/api/trades", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactions),
      });
  
      if (response.ok) {
        console.log("Transactions updated successfully.");
        alert("Transactions updated successfully!");
      } else {
        console.error("Error updating transactions:", await response.text());
        alert("Failed to update transactions.");
      }
    } catch (error) {
      console.error("Error updating transactions:", error);
      alert("Failed to update transactions.");
    }
  };

  const validTransactions = transactions.filter(
    (tx) =>
      tx.token_bought_symbol &&
      tx.amount_usd &&
      tx.block_month &&
      tx.block_date &&
      tx.block_time &&
      !isNaN(Number(tx.amount_usd))
  );

  const groupedData = validTransactions.reduce((acc, tx) => {
    const { token_bought_symbol, amount_usd, block_month, block_date, block_time } = tx;
    const label = `${block_month} ${block_date} ${block_time}`;
    if (!acc[token_bought_symbol]) {
      acc[token_bought_symbol] = [];
    }
    acc[token_bought_symbol].push({
      label,
      amount_usd: Number(amount_usd),
    });
    return acc;
  }, {});

  const filteredChartData = selectedTokens.map((token) => ({
    token,
    data: groupedData[token.value] || [],
  }));

  return (
    <div className="app-container">
      <div className="dropdown-container">
        <h3>Select Tokens to Display</h3>
        <Select
          options={allTokens}
          isMulti
          onChange={setSelectedTokens}
          placeholder="Select token(s)"
          className="dropdown"
        />
      </div>

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
              {filteredChartData.map((tokenData, index) => (
                <Line
                  key={tokenData.token.value}
                  dataKey="amount_usd"
                  data={tokenData.data}
                  name={tokenData.token.label}
                  type="monotone"
                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="transaction-table-container">
        <div className="table-header">
          <h3>Transaction Data</h3>
          <button onClick={handleAddRow} className="add-button">
            Add +
          </button>
          <button onClick={handleUpdate} className="update-button">
            Update Backend
          </button>
        </div>
        <table>
          <thead>
            <tr>
              {fieldNames.map((fieldName) => (
                <th key={fieldName}>{fieldName.replace(/_/g, ' ').toUpperCase()}</th>
              ))}
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, rowIndex) => (
              <tr key={rowIndex}>
                {fieldNames.map((key, cellIndex) => (
                  <td key={cellIndex}>
                    <input
                      type="text"
                      value={transaction[key] !== null ? transaction[key] : ""}
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
      </div>
    </div>
  );
}

export default App;
