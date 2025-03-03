import {SERVER_URL, PORT} from './../config/env.js';
import axios from 'axios';

// Function to test the sign-out API endpoint
const testSignOut = async () => {
  try {
    // Replace this URL with your actual API endpoint
    const response = await axios.post(`${SERVER_URL}/api/v1/auth/sign-out`);

    // Log the status and response body
    console.log('Status:', response.status); // Should be 200 if successful
    console.log('Response:', response.data); // Should have msg: "User signed out successfully"
  } catch (error) {
    if (error.response) {
      // If the error is from the server (e.g., 500 error)
      console.error('Error:', error.response.status);
      console.error('Error Message:', error.response.data);
    } else {
      // If the error is from axios itself (e.g., network issues)
      console.error('Error:', error.message);
    }
  }
};

// Run the test
testSignOut();
