# Movie Ticket Booking System

A full-stack web application that allows users to browse movies, select showtimes, choose seats, and book tickets. This project demonstrates a complete development lifecycle from backend creation to frontend integration and final deployment.

**Live Demo:** [**movieticketbooking-prathik.netlify.app**](https://movieticketbooking-prathik.netlify.app/)

_(Suggestion: You can add a screenshot of your application here)_

---

## Table of Contents

- [Development Approach](#development-approach)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started: Local Setup](#getting-started-local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## Development Approach

This project was built using a backend-first methodology, ensuring that the core business logic and data management were robust before building the user interface.

1.  **Backend Foundation (Node.js & Express.js):** The first phase involved building the server-side application. An Express.js server was set up to handle API requests, and a modular structure was created to separate routes, controllers, and database configurations. This established the backbone of the application.

2.  **Database Architecture (PostgreSQL):** A relational database schema was designed using PostgreSQL to store all application data. This included creating tables for `users`, `movies`, `bookings`, `showtimes`, and other related entities. The schema was carefully planned to ensure data integrity and efficient querying.

3.  **Middleware and Authentication:** Key middleware was integrated into the Express server. `cors` was configured to handle cross-origin requests between the frontend and backend, and `express.json()` was used to parse incoming request bodies. A secure authentication system using JSON Web Tokens (JWT) was implemented to protect user-specific routes and manage user sessions.

4.  **Frontend Scaffolding (React):** With the backend API in place, the focus shifted to the user interface. The frontend was built using React. To accelerate development and create a modern UI, pre-built components from various web resources were adapted and integrated into the project.

5.  **API Integration:** The React frontend was connected to the backend API. Services were created to handle HTTP requests for user signup/login, fetching movie data, and submitting bookings. This brought the application to life, allowing dynamic data to flow from the server to the client.

6.  **Deployment (Render & Netlify):** For the final phase, the application was deployed to live servers.
    - The **Node.js backend** was deployed on **Render**, which was configured to run the server and connect to a production PostgreSQL database instance.
    - The **React frontend** was deployed on **Netlify**, with environment variables set to point to the live backend API on Render.

---

## Features

- **User Authentication:** Secure user registration and login system using JWT.
- **Movie Listings:** Browse a gallery of currently playing and upcoming movies.
- **Detailed Movie Views:** View details for a specific movie, including synopsis and showtimes.
- **Interactive Seat Selection:** A visual seat map for users to choose their preferred seats.
- **Booking System:** Complete the booking process and view booking history.

---

## Tech Stack

| Category       | Technology                                         |
| :------------- | :------------------------------------------------- |
| **Backend**    | Node.js, Express.js                                |
| **Frontend**   | React.js                                           |
| **Database**   | PostgreSQL                                         |
| **Deployment** | Render (Backend), Netlify (Frontend)               |
| **Libraries**  | `pg`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv` |

---

## Getting Started: Local Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

Make sure you have the following software installed:

- Node.js (v14 or later)
- npm or yarn
- Git
- PostgreSQL: A local PostgreSQL server instance.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup

First, set up and run the backend server.

1.  **Navigate to the backend directory:**

    ```bash
    cd movieBackend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the PostgreSQL Database:**

    - Open `psql` or your preferred PostgreSQL client.
    - Create a new database for the project.
      ```sql
      CREATE DATABASE movie_booking_db;
      ```

4.  **Create the Environment File:**

    - Create a new file named `.env` in the `movieBackend` directory.
    - Copy the contents below into your `.env` file and fill in your local database credentials.

    ```env
    # Server Port
    PORT=5000

    # PostgreSQL Database Connection
    DB_USER=your_postgres_username
    DB_PASSWORD=your_postgres_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_DATABASE=movie_booking_db

    # JWT Secret for Authentication
    JWT_SECRET=your_super_secret_jwt_key
    ```

5.  **Run the Database Schema:**

    - Your project includes a `DBB.TXT` file with all the necessary SQL commands. Rename it to `schema.sql`.
    - Run this file against the database you created to set up all the tables.
      ```bash
      psql -U your_postgres_username -d movie_booking_db -f schema.sql
      ```
    - You will be prompted for your password.

6.  **Start the Backend Server:**
    ```bash
    npm run dev
    ```
    The backend server should now be running on `http://localhost:5000`.

### 3. Frontend Setup

Now, set up and run the React frontend in a new terminal window.

1.  **Navigate to the frontend directory:**

    ```bash
    # From the root project directory
    cd movieFrontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create the Environment File:**

    - The frontend needs to know where the backend API is running. Create a `.env` file in the `movieFrontend` directory.
    - Add the following line:
      ```env
      REACT_APP_API_URL=http://localhost:5000
      ```

4.  **Start the Frontend Application:**
    ```bash
    npm start
    ```
    Your browser should open to `http://localhost:3000`, and the application should be fully functional.

---

## Environment Variables

### Backend (`/movieBackend/.env`)

- `PORT`: The port on which the Express server runs.
- `DB_*`: Credentials for connecting to the PostgreSQL database.
- `JWT_SECRET`: A secret key for signing and verifying JSON Web Tokens.

### Frontend (`/movieFrontend/.env`)

- `REACT_APP_API_URL`: The base URL of the backend API. This is `http://localhost:5000` for local development and the Render URL for production.

---

## Deployment

This application is deployed with a split frontend/backend architecture:

- **Backend (Render):** The `movieBackend` directory is deployed as a "Web Service" on Render. The `DATABASE_URL` environment variable is configured to use a managed PostgreSQL instance from Render.

- **Frontend (Netlify):** The `movieFrontend` directory is deployed on Netlify. The `REACT_APP_API_URL` build environment variable is set to the live URL of the Render backend service.

---

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
