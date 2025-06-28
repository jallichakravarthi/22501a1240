import axios from 'axios';

const ACCESS_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJqYWxsaWNoYWtyYXZhcnRoaUBnbWFpbC5jb20iLCJleHAiOjE3NTEwOTM3NjcsImlhdCI6MTc1MTA5Mjg2NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImMwYWU4ZmY1LTEzZWYtNGY4MS04ZDI1LTY0ZWRkMGZjYzA5NCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImphbGxpIGNoYWtyYXZhcnRoaSIsInN1YiI6IjhhNzU2MGEyLTliZGItNGJkZC05NDVjLWE3OGFlZDI4M2U2MiJ9LCJlbWFpbCI6ImphbGxpY2hha3JhdmFydGhpQGdtYWlsLmNvbSIsIm5hbWUiOiJqYWxsaSBjaGFrcmF2YXJ0aGkiLCJyb2xsTm8iOiIyMjUwMWExMjQwIiwiYWNjZXNzQ29kZSI6ImVIV056dCIsImNsaWVudElEIjoiOGE3NTYwYTItOWJkYi00YmRkLTk0NWMtYTc4YWVkMjgzZTYyIiwiY2xpZW50U2VjcmV0IjoiTmZUa2JOSnpKbll5eXdZVyJ9.mZfjK1lVyPcuR3pfG00LVF3WJx7t9Za7E4B0I7-zUp0';

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
