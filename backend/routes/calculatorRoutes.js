const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculatorController');

router.post('/sip', calculatorController.sip);
router.post('/fd', calculatorController.fd);
router.post('/compound-interest', calculatorController.compoundInterest);
router.post('/savings-goal', calculatorController.savingsGoal);

module.exports = router;
