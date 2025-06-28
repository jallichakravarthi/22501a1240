const axios = require('axios');

// Logger Middleware
// This middleware logs incoming requests to an external logging service and also to local terminal for debug purposes.
// It expects the request body to contain 'stack', 'level', 'package', and 'message' fields.
const loggerMiddleware = async (req, res, next) => {
  const { stack, level, package: packageName, message } = req.body;

  // Checking for essential fields
  if (!stack || !level || !packageName || !message) {
    console.warn("Missing one or more logging fields (stack, level, package, message). Skipping logging.");
    return next();
  }

  const logPayload = {
    stack,
    level,
    package: packageName,
    message,
  };

  try {
    const response = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      logPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqYWxsaWNoYWtyYXZhcnRoaUBnbWFpbC5jb20iLCJleHAiOjE3NTEwOTM3NjcsImlhdCI6MTc1MTA5Mjg2NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImMwYWU4ZmY1LTEzZWYtNGY4MS04ZDI1LTY0ZWRkMGZjYzA5NCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImphbGxpIGNoYWtyYXZhcnRoaSIsInN1YiI6IjhhNzU2MGEyLTliZGItNGJkZC05NDVjLWE3OGFlZDI4M2U2MiJ9LCJlbWFpbCI6ImphbGxpY2hha3JhdmFydGhpQGdtYWlsLmNvbSIsIm5hbWUiOiJqYWxsaSBjaGFrcmF2YXJ0aGkiLCJyb2xsTm8iOiIyMjUwMWExMjQwIiwiYWNjZXNzQ29kZSI6ImVIV056dCIsImNsaWVudElEIjoiOGE3NTYwYTItOWJkYi00YmRkLTk0NWMtYTc4YWVkMjgzZTYyIiwiY2xpZW50U2VjcmV0IjoiTmZUa2JOSnpKbll5eXdZVyJ9.mZfjK1lVyPcuR3pfG00LVF3WJx7t9Za7E4B0I7-zUp0`
        }
      }
    );

    // Debug print the logging response
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Log sent: ${JSON.stringify(logPayload)}`);
      console.log(`Log Response: ${JSON.stringify(response.data)}`);
    }

    req.log = response.data;

  } catch (err) {
    console.error('Failed to send log:', err.message);
  }

  next();
};

module.exports = loggerMiddleware;
