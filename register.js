// Let's create a separate registration script to ensure we register first

// register.js
const axios = require('axios');

const TEST_SERVER_BASE_URL = 'http://20.244.56.144/evaluation-service';

async function registerWithTestServer() {
  try {
    console.log('Attempting to register with the test server...');
    
    const registrationData = {
      email: "akshama.2226csit1073@kiet.edu",
      name: "akshama",
      mobileNo: "9389676456",
      githubUsername: "Akshama2003",
      rollNo: "2200290110010",
      collegeName: "Kiet Group of Instituions",
      accessCode: "SxVeja"
    };
    
    const response = await axios.post(`${TEST_SERVER_BASE_URL}/register`, registrationData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
    console.log('Registration response:', response.data);
    console.log('\nIMPORTANT: Save these credentials, you cannot get them again:');
    console.log('Client ID:', response.data.clientID);
    console.log('Client Secret:', response.data.clientSecret);
    console.log('\nUpdate your calculator.js with these credentials.');
    
  } catch (error) {
    console.error('Registration error:', error.message);
    if (error.response) {
      console.error('Error details:', {
        status: error.response.status,
        data: error.response.data
      });
    }
  }
}

// Execute registration
registerWithTestServer();