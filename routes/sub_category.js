const express = require('express');
const subCategoryRouter = express.Router();

subCategoryRouter.post('/subcategories', async (req, res) => {
  try {
    // Import SubCategory model inside the route to avoid circular dependency
    const SubCategory = require('../models/sub_category');
    
    const { categoryId, categoryName, image, subCategoryName } = req.body;
    const newSubCategory = new SubCategory({ categoryId, categoryName, image, subCategoryName });
    await newSubCategory.save();
    res.status(201).json({ 
      message: 'Subcategory created successfully!', 
      subCategory: newSubCategory 
    });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to retrieve all subcategories
subCategoryRouter.get('/subcategories', async (req, res) => {
  try {
    // Import SubCategory model inside the route to avoid circular dependency
    const SubCategory = require('../models/sub_category');
    
    const subCategories = await SubCategory.find();
    res.status(200).json({ subCategories });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to retrieve subcategories by category name
subCategoryRouter.get('/category/:categoryName/subcategories', async (req, res) => {
    try {
        const SubCategory = require('../models/sub_category');
        const { categoryName } = req.params;
        console.log('Fetching subcategories for category:', categoryName);
        
        const subCategories = await SubCategory.find({ categoryName: categoryName });
        console.log('Found subcategories:', subCategories);
        
        if (!subCategories || subCategories.length === 0) {
            return res.status(404).json({ message: 'No subcategories found for this category' });
        } else {
            return res.status(200).json({ message: 'Subcategories fetched successfully', subCategories });
        }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = subCategoryRouter;
// Use this router in your main app file (e.g., index.js) by importing it