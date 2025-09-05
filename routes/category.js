const express = require('express');
const categoryRouter = express.Router();

categoryRouter.post('/categories', async (req, res) => {
  try {
    // Import Category model inside the route to avoid circular dependency
    const Category = require('../models/category');
    
    const { name, image, banner } = req.body;
    const newCategory = new Category({ name, image, banner });
    await newCategory.save();
    res.status(201).json({ 
      message: 'Category created successfully!', 
      category: newCategory 
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to retrieve all categories
categoryRouter.get('/categories', async (req, res) => {
  try {
    // Import Category model inside the route to avoid circular dependency
    const Category = require('../models/category');
    
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = categoryRouter;