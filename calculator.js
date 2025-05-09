// average-calculator-service.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Configuration
const PORT = 9877;
const WINDOW_SIZE = 10;
const TEST_SERVER_BASE_URL = 'http://20.244.56.144/evaluation-service';
const TIMEOUT_MS = 500;

// Authentication credentials
const AUTH_CREDENTIALS = {
  email: "akshama.2226csit1073@kiet.edu",
  name: "akshama",
  rollNo: "2200290110010",
  accessCode: "SxVeja",
  clientID: "d9cbb699-6a27-44a5-8d59-8b1befa816da",
  clientSecret: "tVJaaaRBSeXcRXeM"
};

// Token storage
let authToken = null;
let tokenExpiry = 0;

// Store for numbers
let numberStore = [];

// Map of number types to their API endpoints
const numberTypeEndpoints = {
  'p': 'primes',  // Prime numbers
  'f': 'fibo',    // Fibonacci numbers
  'e': 'even',    // Even numbers
  'r': 'random'   // Random numbers
};

// Helper function to get authentication token
async function getAuthToken() {
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Check if we already have a valid token
  if (authToken && tokenExpiry > currentTime + 60) {
    return authToken;
  }
  
  try {
    console.log('Fetching new authentication token...');
    const response = await axios.post(`${TEST_SERVER_BASE_URL}/auth`, AUTH_CREDENTIALS, { timeout: TIMEOUT_MS });
    
    if (response.data && response.data.access_token) {
      authToken = response.data.access_token;
      tokenExpiry = response.data.expires_in;
      console.log('New token acquired, expires at:', new Date(tokenExpiry * 1000).toISOString());
      return authToken;
    } else {
      console.error('Invalid token response:', response.data);
      throw new Error('Failed to get valid authentication token');
    }
  } catch (error) {
    console.error('Error getting authentication token:', error.message);
    throw error;
  }
}

// Helper function to calculate average of numbers
function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return (sum / numbers.length).toFixed(2);
}

// Endpoint to get numbers by type and calculate average
app.get('/numbers/:numberid', async (req, res) => {
  const numberType = req.params.numberid;
  
  // Check if the number type is valid
  if (!Object.keys(numberTypeEndpoints).includes(numberType)) {
    return res.status(400).json({ error: 'Invalid number type. Use p, f, e, or r.' });
  }
  
  try {
    // Store current state before fetching new numbers
    const windowPrevState = [...numberStore];
    
    // Get authentication token
    const token = await getAuthToken();
    
    // Fetch numbers from the test server
    const endpoint = `${TEST_SERVER_BASE_URL}/${numberTypeEndpoints[numberType]}`;
    
    // Add timeout to the request and authentication header
    const response = await axios.get(endpoint, { 
      timeout: TIMEOUT_MS,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Extract numbers from response
    const fetchedNumbers = response.data.numbers || [];
    
    // Add new unique numbers to the store
    const prevLength = numberStore.length;
    
    for (const num of fetchedNumbers) {
      if (!numberStore.includes(num)) {
        if (numberStore.length < WINDOW_SIZE) {
          // Add the number if we haven't reached window size
          numberStore.push(num);
        } else {
          // Remove the oldest number and add the new one
          numberStore.shift();
          numberStore.push(num);
        }
      }
    }
    
    // Calculate average
    const avg = calculateAverage(numberStore);
    
    // Return the response
    return res.json({
      windowPrevState,
      windowCurrState: numberStore,
      numbers: fetchedNumbers,
      avg
    });
    
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      // Request timed out but still return current state
      return res.json({
        windowPrevState: numberStore,
        windowCurrState: numberStore,
        numbers: [],
        avg: calculateAverage(numberStore)
      });
    }
    
    console.error('Error fetching numbers:', error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch numbers',
      windowPrevState: numberStore,
      windowCurrState: numberStore,
      numbers: [],
      avg: calculateAverage(numberStore)
    });
  }
});

// Route for manual registration (should only be used once)
app.post('/register', async (req, res) => {
  try {
    const registrationData = {
      email: "akshama.2226csit1073@kiet.edu",
      name: "akshama",
      mobileNo: "9389676456",
      githubUsername: "Akshama2003",
      rollNo: "2200290110010",
      collegeName: "Kiet Group of Instituions",
      accessCode: "SxVeja"
    };
    
    const response = await axios.post(`${TEST_SERVER_BASE_URL}/register`, registrationData);
    res.json(response.data);
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Average Calculator Service running on http://localhost:${PORT}`);
  
  // Try to get initial auth token on startup
  try {
    await getAuthToken();
    console.log('Successfully authenticated with the test server');
  } catch (error) {
    console.error('Initial authentication failed:', error.message);
    console.log('Service started, but authentication will be retried on first request');
  }
});