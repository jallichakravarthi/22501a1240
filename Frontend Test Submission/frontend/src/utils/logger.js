import axios from 'axios';

// Replace this with your actual token
const ACCESS_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Truncated for safety

const logEvent = async ({ level = 'info', message = '', stack = 'frontend', pkg = 'component' }) => {
  try {
    const response = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Logger response:', response.data);
  } catch (err) {
    console.error('Logging failed:', err.message);
  }
};

export default logEvent;
