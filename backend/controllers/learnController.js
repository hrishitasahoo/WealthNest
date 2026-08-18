const asyncHandler = require('../middleware/asyncHandler');
const learnModel = require('../models/learnModel');

const listTopics = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const topics = await learnModel.listLearningTopics({ category });
  res.status(200).json({ success: true, data: { topics } });
});

const getTopic = asyncHandler(async (req, res) => {
  const topic = await learnModel.getLearningTopicBySlug(req.params.slug);
  if (!topic) {
    return res.status(404).json({ success: false, message: 'That learning topic could not be found.' });
  }
  res.status(200).json({ success: true, data: { topic } });
});

module.exports = { listTopics, getTopic };
