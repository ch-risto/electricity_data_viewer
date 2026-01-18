# Electricity Data Viewer

This project is a web application that displays electricity production, consumption, and price data. The application consists of a **FastAPI** backend and a **React** frontend. It fetches data from a **PostgreSQL** database running in Docker.

This project is first created as a response to Solita Dev Academy 2025 pre-assignment and updated to be used also in 2026. More of updates made in 2026 [here](#2026-pre-assignment).

## Features

### Daily Statistics List (Implemented Features)

- Total electricity consumption per day
- Total electricity production per day
- Average electricity price per day
- Longest consecutive time in hours when electricity price has been negative per day
- Data can be fetched based on the selected date

## Technologies Used

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **Frontend:** React, TypeScript, Styled Components
- **Database:** PostgreSQL (running in Docker)
- **Containerization:** Docker & Docker Compose

## Running the Project

### Prerequisites

Ensure you have the following installed on your system:

- [Docker Desktop](https://docs.docker.com/desktop/)
- [Node.js & npm](https://nodejs.org/)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Copy the environment configuration file:
   ```bash
   cp backend/.env-example backend/.env
   ```
3. Start the backend and database using Docker:
   ```bash
   docker compose up --build --renew-anon-volumes -d
   ```
   > Note: This may take a few minutes on the first run.
4. The backend will now be running at `http://localhost:8000`
5. You can inspect the database via Adminer at `http://localhost:8088/`
   - **Username:** academy
   - **Password:** academy
   - **Database Name:** electricity

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. The frontend will now be available at `http://localhost:5173`

## API Endpoints

The FastAPI documentation for the backend endpoints can be accessed at:
Swagger UI: http://localhost:8000/docs#/

### Fetch electricity data for a specific date

```http
GET /electricity/by_date/YYYY-MM-DD
```

Response Example:

```json
{
  "date": "2023-05-05",
  "total_consumption": 15000.123,
  "total_production": 14000.456,
  "avg_price": 0.067,
  "longest_negative_price_hours": 3
}
```

## 2026 pre-assignment

As the 2026 pre-assignment was the same as last year, I decided to take this as an learning opportunity to improve my skills in testing and cloud infrastructures. I also improved DevOps implementing GitHub Workflow to the project.

### CI/CD

### Testing

#### PyTest

For backend, tests are written for pytest. The goal was not to cover everything, but get a good impression of what automation testing is all about and grasp knowledge of few different type of tests. AI was used to help to gain knowledge of good practices and different methods.

### Use of AI

GitHub Copilot (Claude Haiku 4.5, Claude Sonnet 4.5) has been used while developing this project. I used Agent mode, but just so Copilot would get hinge of the project structure to be able to give me the best suggestions. I took this excercise as a learning opportunity to dive deeper in technologies I used, so I kept asking "dump questions" and different approaches before settling to something. All new code is reviewed and implemented by me.

Copilot was also used in debugging and formatting.
