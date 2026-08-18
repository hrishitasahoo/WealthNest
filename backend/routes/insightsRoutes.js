const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', insightsController.getInsights);

module.exports = router;
