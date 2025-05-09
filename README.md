# 📊 Average Calculator Microservice

![Average Calculator Logo](https://via.placeholder.com/600x150.png?text=Average+Calculator+Microservice)

A lightweight Node.js REST API that retrieves different sets of numbers (prime, Fibonacci, even, random) from a third-party service and maintains a **rolling window** of unique values to compute their average.

---

## 🔧 Features

- ✅ REST endpoint `/numbers/{numberid}`
- 🔢 Supports:
  - `p` ➝ Prime numbers
  - `f` ➝ Fibonacci numbers
  - `e` ➝ Even numbers
  - `r` ➝ Random numbers
- 🪟 Maintains a unique number window (default size: 10)
- ⏱️ Ignores numbers if third-party response takes > 500ms
- 🔁 Returns previous and current window states, along with average

---

## ⚙️ Setup Instructions

> 💡 Prerequisite: Node.js v14+

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/average-calculator-microservice.git
   cd average-calculator-microservice
2. npm install
3. npm start
✅ Server will start on http://localhost:9876
📡 API Endpoints
🔢 Number Endpoint
GET /numbers/{numberid}
| numberid | Description       |
| -------- | ----------------- |
| p        | Prime numbers     |
| f        | Fibonacci numbers |
| e        | Even numbers      |
| r        | Random numbers    |
📷 Sample Response
{
  "windowPrevState": [2, 3, 5],
  "windowCurrState": [2, 3, 5, 7],
  "numbers": [7],
  "avg": "4.25"
}
📝 Registration Endpoint

POST /register
⚠️ Use once only for authentication with the third-party server.

⚙️ Configuration
Adjust these constants in the code as needed:

Name	Description	Default
PORT	Port the server listens on	9876
WINDOW_SIZE	Unique number window size	10
TIMEOUT_MS	Max timeout for 3rd-party server (ms)	500
TEST_SERVER_BASE_URL	URL of the number provider API	<set yours>
AUTH_CREDENTIALS	Auth for third-party registration	<set yours>

⚠️ Error Handling
🔌 Timeouts: If third-party response exceeds 500ms, the window remains unchanged.

❌ Invalid number type: Returns HTTP 400 Bad Request.
