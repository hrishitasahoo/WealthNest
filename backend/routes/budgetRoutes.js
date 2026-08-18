const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', budgetController.listBudgetEntries);
router.get('/summary', budgetController.getExpenseSummary);
router.post('/', budgetController.createBudgetEntry);
router.put('/:id', budgetController.updateBudgetEntry);
router.delete('/:id', budgetController.deleteBudgetEntry);

module.exports = router;
