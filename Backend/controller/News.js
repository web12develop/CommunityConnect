const News = require('../models/News');
const { validationResult } = require('express-validator');

// Create a new news article
exports.createNews = async (req, res) => {
  try {
    const { title, content, author, image } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create new news instance
    const news = new News({
      title,
      content,
      author,
      image // Store image URL in news object
    });

    // Save news article to database
    await news.save();

    res.status(201).json({ success: true, data: news });
  } catch (error) {
    console.error('Error creating news article:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all news articles
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a single news article by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    console.error('Error fetching news article by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update news article by ID
exports.updateNewsById = async (req, res) => {
  try {
    const { title, content, author, image } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        author,
        image // Update image URL in news object
      },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.status(200).json({ success: true, data: updatedNews });
  } catch (error) {
    console.error('Error updating news article by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete news article by ID
exports.deleteNewsById = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.status(200).json({ success: true, message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news article by ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
