const express = require('express');
const router = express.Router();
const learnController = require('../controllers/learnController');

router.get('/', learnController.listTopics);
router.get('/:slug', learnController.getTopic);

module.exports = router;
