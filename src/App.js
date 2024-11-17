import React, { useEffect, useState } from "react";
import Papa from "papaparse";
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

  useEffect(() => {
    const fetchCSV = async () => {
      console.log("Fetching CSV file...");
      try {
        const response = await fetch("/DEX 411 Tables - Trades.csv"); // Adjust path if necessary
        const csvText = await response.text();

        console.log("CSV file fetched successfully.");
        console.log("Parsing CSV data...");

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          transformHeader: (header) => header.trim(),
          complete: (result) => {
            console.log("CSV parsing complete. Parsed data:", result.data);

            const parsedData = result.data.map((row) => ({
              blockchain: row.blockchain || "",
              project: row.project || "",
              version: row.version || "",
              block_month: row.block_month || "",
              block_date: row.block_date || "",
              block_time: row.block_time || "",
              block_number: row.block_number || "",
              token_bought_symbol: row.token_bought_symbol || "",
              token_sold_symbol: row.token_sold_symbol || "",
              token_pair: row.token_pair || "",
              token_bought_amount: row.token_bought_amount || "",
              token_sold_amount: row.token_sold_amount || "",
              token_bought_amount_raw: row.token_bought_amount_raw || "",
              token_sold_amount_raw: row.token_sold_amount_raw || "",
              amount_usd: row.amount_usd || "",
              token_bought_address: row.token_bought_address || "",
              token_sold_address: row.token_sold_address || "",
              taker: row.taker || "",
              maker: row.maker || "",
              project_contract_address: row.project_contract_address || "",
              tx_hash: row.tx_hash || "",
              tx_from: row.tx_from || "",
              tx_to: row.tx_to || "",
              evt_index: row.evt_index || "",
            }));

            console.log("Parsed data mapped to table structure:", parsedData);
            setTransactions(parsedData);

            const uniqueTokens = [
              ...new Set(
                parsedData.map((tx) => tx.token_bought_symbol).filter(Boolean)
              ),
            ];
            setAllTokens(uniqueTokens.map((token) => ({ label: token, value: token })));
          },
          error: (error) => {
            console.error("Error parsing CSV data:", error);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV file:", error);
      }
    };

    fetchCSV();
  }, []);

  // Update cell value
  const handleCellChange = (e, rowIndex, key) => {
    const newTransactions = [...transactions];
    newTransactions[rowIndex][key] = e.target.value;
    setTransactions(newTransactions);
  };

  // Add a new empty row
  const handleAddRow = () => {
    const now = new Date();
    const newRow = {
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
    };
  
    // Prepend the new row to the transactions array
    setTransactions([newRow, ...transactions]);
  };  

  // Delete a row
  const handleDeleteRow = (rowIndex) => {
    const newTransactions = transactions.filter((_, index) => index !== rowIndex);
    setTransactions(newTransactions);
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
        </div>
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
      </div>
    </div>
  );
}

export default App;
