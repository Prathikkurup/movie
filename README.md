# Movie Booking Application

This is a full-stack web application for booking movie tickets. It features a Node.js backend with an Express server and a PostgreSQL database, and a React-based frontend.

## Project Structure

```
├── movieBackend/     # Node.js/Express backend
└── movieFrontend/    # React frontend
```

## Features

- User registration and login.
- Browse a list of available movies and their showtimes.
- View seat availability for a specific showtime.
- Book tickets for a movie.
- View and cancel existing bookings.

---

## Getting Started

### Prerequisites

- Node.js
- npm (or yarn/pnpm)
- PostgreSQL

### Backend Setup

1.  Navigate to the backend directory: `cd movieBackend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and configure your database connection and JWT secret.
4.  Start the server: `npm start`

### Frontend Setup

1.  Navigate to the frontend directory: `cd movieFrontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm start`
