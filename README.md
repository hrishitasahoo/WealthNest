# WealthNest

A personal finance and budgeting web app built for Indian users — track expenses, plan a monthly budget, set savings goals, and learn basic financial concepts like SIP, FD, and PPF.

Built with Node.js, Express, MySQL, and plain HTML/CSS/JS.

## Features

- Login/signup with hashed passwords (bcrypt) and JWT sessions
- Forgot password flow — sends a secure, time-limited reset link by email
- Expense tracker with categories and payment methods
- Budget planner that recommends a Needs/Wants/Savings split based on income, and compares it against what you've actually spent
- Financial goals with auto-calculated monthly savings targets
- Savings tracker with weekly/monthly/yearly charts
- SIP, FD, compound interest and savings goal calculators
- Government schemes directory with verified official source links
- Rule-based spending insights (no AI — plain JS logic run on your own recorded data)
- Account settings for username, email and password

## Tech stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Auth:** JWT + bcrypt
- **Email:** Brevo transactional email API (HTTP, not SMTP)

## Running it locally

1. Install dependencies
   ```bash
   npm install
   ```

2. Set up your environment variables
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with:
   - Your MySQL credentials
   - A random `JWT_SECRET`
   - Optionally, a [Brevo](https://www.brevo.com) API key (`BREVO_API_KEY`, `EMAIL_FROM_ADDRESS`) so password reset links actually get emailed. Brevo's free plan sends up to 300 emails/day over HTTPS — this is deliberate rather than SMTP, since most free hosting platforms (Render, Vercel, etc.) block outbound SMTP ports.
   - If email isn't configured, reset links print to the server console instead, so the app still works fully for local testing.

3. Create and seed the database
   ```bash
   npm run seed
   ```

4. Start the server
   ```bash
   npm start
   ```

5. Open `http://localhost:5000`

## Project structure

- `backend/` — Express server, routes, controllers, services, MySQL models
- `frontend/` — HTML pages, CSS, and vanilla JS
- `database/` — schema and seed data
