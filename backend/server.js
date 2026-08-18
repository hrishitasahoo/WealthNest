require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { testConnection } = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const profileRoutes = require('./routes/profileRoutes');
const goalsRoutes = require('./routes/goalsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const budgetPlanRoutes = require('./routes/budgetPlanRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const schemesRoutes = require('./routes/schemesRoutes');
const learnRoutes = require('./routes/learnRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/budget-plan', budgetPlanRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/calculators', calculatorRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'WealthNest API is running.' });
});

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.use('/api', notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[server] WealthNest is running on http://localhost:${PORT}`);
  testConnection();
});
