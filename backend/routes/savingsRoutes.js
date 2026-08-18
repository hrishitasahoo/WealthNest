const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.get('/', savingsController.listSavingsEntries);
router.post('/', savingsController.createSavingsEntry);
router.put('/:id', savingsController.updateSavingsEntry);
router.delete('/:id', savingsController.deleteSavingsEntry);

module.exports = router;
