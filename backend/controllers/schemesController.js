const asyncHandler = require('../middleware/asyncHandler');
const schemeModel = require('../models/schemeModel');

const listSchemes = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const schemes = await schemeModel.listSchemes({ category, search });
  res.status(200).json({ success: true, data: { schemes } });
});

module.exports = { listSchemes };
