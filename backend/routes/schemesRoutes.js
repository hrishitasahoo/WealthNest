const express = require('express');
const router = express.Router();
const schemesController = require('../controllers/schemesController');

router.get('/', schemesController.listSchemes);

module.exports = router;
