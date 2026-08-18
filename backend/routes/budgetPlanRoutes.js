const express = require('express');
const router = express.Router();
const budgetPlanController = require('../controllers/budgetPlanController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', budgetPlanController.getPlan);
router.put('/', budgetPlanController.savePlan);

module.exports = router;
