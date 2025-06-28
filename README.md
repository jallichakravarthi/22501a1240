

# URL Shortener – Full Stack Project

This is a full-stack URL shortener application built using React (frontend), Node.js and Express (backend), and MongoDB for storage. It includes a custom logger middleware used by both frontend and backend to log key events to an external logging service.

---

## Project Structure

```
22501A1240/
├── Backend Test Submission/
│   ├── models/
│   │   └── Url.js
│   ├── routes/
│   │   └── urlRoutes.js
│   ├── utils/
│   │   └── generateShortCode.js
│   ├── server.js
│   └── .env
├── Logger Middleware/
│   └── loggerMiddleware.js
├── Frontend Test Submission/
│   └── frontend/
│       ├── public/
│       └── src/
│           ├── App.js
│           ├── index.js
│           ├── pages/
│           │   ├── Home.js
│           │   └── Stats.js
│           └── utils/
│               └── logger.js

```

---

## Features

- Shorten long URLs with optional custom shortcode and expiry time
- Redirect to the original URL when short URL is accessed
- Track number of clicks with timestamps and referrer info
- View all shortened URLs with analytics
- Centralized logger middleware for both frontend and backend

---

## Backend Setup

1. Navigate to backend directory:

```

cd "Backend Test Submission"

```

2. Install dependencies:

```

npm install

```

3. Create a `.env` file:

```

PORT=3500
MONGO\_URI=mongodb://localhost:27017/urlshortener
LOGGER\_API=[https://logservice.example.com/logs](https://logservice.example.com/logs)
LOGGER\_TOKEN=Bearer your\_token\_here

```

4. Start the server:

```

npm run dev

```

---

## Frontend Setup

1. Navigate to frontend directory:

```

cd "Frontend Test Submission/frontend"

```

2. Install dependencies:

```

npm install

```

3. Start the frontend server:

```

npm start

````

---

## API Endpoints

| Method | Endpoint                  | Description                         |
|--------|---------------------------|-------------------------------------|
| POST   | `/shorturls`              | Create a new short URL              |
| GET    | `/shorturls/:shortcode`   | Redirect to original URL            |
| GET    | `/shorturls`              | Get all shortened URLs with stats   |

---

## Request Example

**POST** `/shorturls`

Request body:

```json
{
  "url": "https://example.com",
  "shortcode": "custom123",
  "validity": 15
}
````

Response:

```json
{
  "message": "Short URL created",
  "shortcode": "custom123"
}
```

---

## Logger Middleware

Both the frontend and backend use the logger middleware to log events such as:

* URL created
* Redirect success or failure
* Errors during request handling

### Logger Config:

* **Location (backend):** `Logger Middleware/loggerMiddleware.js`
* **Location (frontend):** `src/utils/logger.js`

All logs are sent to the configured `LOGGER_API` with a valid bearer token.

---

## Postman Testing

1. Use POST `/shorturls` to create a short URL
2. Use GET `/shorturls/:shortcode` to test redirection
3. Use GET `/shorturls` to retrieve all short URLs

Make sure the backend server is running on `http://localhost:3500`.

---

## Notes

* The default validity period is 30 minutes if not provided.
* The `shortcode` is auto-generated if not specified.
* Expired shortcodes return a 410 Gone response.

---

## Author

Jalli Chakravarthi
22501A1240
GitHub: [https://github.com/jallichakravarthi](https://github.com/jallichakravarthi)

