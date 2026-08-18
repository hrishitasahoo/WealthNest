const asyncHandler = require('../middleware/asyncHandler');
const insightsService = require('../services/insightsService');

const getInsights = asyncHandler(async (req, res) => {
  const insights = await insightsService.generateInsights(req.userId);
  res.status(200).json({ success: true, data: { insights } });
});

module.exports = { getInsights };
