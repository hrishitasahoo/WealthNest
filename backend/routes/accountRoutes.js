const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);
router.put('/', accountController.updateAccount);
router.put('/password', accountController.changePassword);

module.exports = router;
