# WealthNest

A personal finance and budgeting web app built for Indian users — track expenses, plan a monthly budget, set savings goals, and learn basic financial concepts like SIP, FD, and PPF.

Built with Node.js, Express, MySQL, and plain HTML/CSS/JS (no frontend framework).

## Features

- Login/signup with hashed passwords (bcrypt) and JWT sessions
- Expense tracker with categories and payment methods
- Budget planner using the 50/30/20 rule
- Financial goals with auto-calculated monthly savings targets
- Savings tracker with weekly/monthly/yearly charts
- SIP, FD, compound interest and savings goal calculators
- Government schemes directory with official links
- Rule-based spending insights (no AI, just plain JS logic on your own data)

## Tech stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Auth:** JWT + bcrypt

## Running it locally

1. Install dependencies
   ```bash
   npm install
   ```

2. Set up your environment variables
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your MySQL credentials and a random JWT secret.

3. Create and seed the database
   ```bash
   npm run seed
   ```

4. Start the server
   ```bash
   npm start
   ```

5. Open `http://localhost:5000`

Demo account: `demo@wealthnest.in` / `Demo@1234`

## Project structure

- `backend/` — Express server, routes, controllers, services, MySQL models
- `frontend/` — HTML pages, CSS, and vanilla JS
- `database/` — schema and seed data
