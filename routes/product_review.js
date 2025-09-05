const express = require('express');
const productReviewRouter = express.Router();

productReviewRouter.post('/product-review', async (req, res) => {
  try {
    // Import ProductReview model inside the route to avoid circular dependency
    const ProductReview = require('../models/product_review');
    
    console.log('Review request body:', req.body); // Debug log
    
    const { productId, buyerId, email, fullName, rating, review } = req.body;
    
    // Validate required fields
    if (!productId || !buyerId || !email || !fullName || !rating || !review) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['productId', 'buyerId', 'email', 'fullName', 'rating', 'review']
      });
    }
    
    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Rating must be between 1 and 5' 
      });
    }
    
    const newReview = new ProductReview({ 
      productId, 
      buyerId, 
      email, 
      fullName, 
      rating: Number(rating), 
      review 
    });
    
    await newReview.save();
    res.status(201).json({ 
      message: 'Product review created successfully!', 
      review: newReview 
    });
  } catch (error) {
    console.error('Error creating product review:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// GET route to retrieve reviews for a product
productReviewRouter.get('/product-review', async (req, res) => {
  try {
    const ProductReview = require('../models/product_review')

    const reviews = await ProductReview.find();
    res.status(200).json({ 
      message: 'Product reviews fetched successfully',
      count: reviews.length,
      reviews 
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

module.exports = productReviewRouter;