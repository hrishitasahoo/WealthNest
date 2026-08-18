const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goalsController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', goalsController.listGoals);
router.post('/', goalsController.createGoal);
router.put('/:id', goalsController.updateGoal);
router.delete('/:id', goalsController.deleteGoal);

module.exports = router;
