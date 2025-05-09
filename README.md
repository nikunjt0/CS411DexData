# 📈 CEX vs DEX Crypto Dashboard

A full-stack cryptocurrency analytics dashboard that compares Centralized Exchanges (CEXs) and Decentralized Exchanges (DEXs). This project provides real-time insights into token trading activity across blockchains and exchange types. Users can view charts, analyze trade data, and modify records via an interactive frontend synced with a MySQL backend.

---

## 🧩 Features

### Frontend

- 🌐 Built with React
- 📊 **Line Chart**: Visualizes USD volume of selected tokens over time
- 🥧 **Pie Charts**:
  - Volume by Blockchain
  - Volume by DEX
- 🏆 **Leaderboard**: Top token pairs by traded volume
- 📋 **Editable Table**:
  - Inline editing of trade data
  - Add/delete transactions
  - Sync updates to backend
- 🔎 **Token Selector**: Filter data by token symbols

### Backend

- 🖥️ Express.js REST API
- 🧠 SQL stored procedures for complex queries
- 💽 GCP-hosted MySQL database (`Crypto`)
- 🔁 Upsert logic using `INSERT ... ON DUPLICATE KEY UPDATE`
- 🧹 Soft-delete logic for table entries

---

## 🛠️ Tech Stack

| Layer     | Technology                             |
|-----------|-----------------------------------------|
| Frontend  | React, Recharts, react-select, CSS      |
| Backend   | Node.js, Express.js, MySQL              |
| Database  | Google Cloud SQL (MySQL)                |
| Testing   | Jest, React Testing Library             |

---

## 🖼️ Architecture Overview

```text
Frontend (React + Recharts)
       │
       ▼
Express.js API (localhost:5001)
       │
       ▼
Google Cloud MySQL (Crypto database)
```


---

## 📦 Tech Stack

| Layer     | Technology                             |
|-----------|-----------------------------------------|
| Frontend  | React, Recharts, react-select, CSS      |
| Backend   | Node.js, Express.js, MySQL              |
| Hosting   | GCP MySQL (Google Cloud SQL)            |
| Styling   | Custom CSS, Flexbox                     |
| Testing   | Jest, React Testing Library             |

---

## 🔧 Installation & Setup

### Frontend

```bash
# Clone the repo
git clone https://github.com/your-org/cex-dex-dashboard.git
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Backend

# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start the backend server
node index.js


## 💡 Use Cases
- Compare DEX vs CEX market volumes
- Analyze trade activity by blockchain
- Discover high-performing token pairs
- Modify and sync transaction data in real-time
- Use as a teaching tool for DeFi or SQL visualization

## 🔮 Future Improvements
- Add real CEX data from Binance/Coinbase APIs
- Authentication and user roles
- Export charts as PNG/CSV
- Pagination and filtering for transaction tables
- Host on Vercel + Render + PlanetScale
