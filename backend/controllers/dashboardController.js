const asyncHandler = require('../middleware/asyncHandler');
const dashboardService = require('../services/dashboardService');

const getDashboard = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary(req.userId);
  res.status(200).json({ success: true, data: summary });
});

module.exports = { getDashboard };
