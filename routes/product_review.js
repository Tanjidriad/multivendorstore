const express = require('express');
const productReviewRouter = express.Router();

// POST route to create a new review
productReviewRouter.post('/product-review', async (req, res) => {
  try {
    // Import ProductReview model inside the route to avoid circular dependency
    const ProductReview = require('../models/product_review');
    
    
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

    // Update product's average rating using INCREMENTAL method (more efficient)
    const Product = require('../models/product');
    const product = await Product.findById(productId);
    if (product) {
      // Increment total ratings first
      product.totalRatings += 1;
      
      // Calculate new average using incremental formula
      product.averageRating = ((product.averageRating * (product.totalRatings - 1)) + Number(rating)) / product.totalRatings;
      
      await product.save();
    }

    res.status(201).json({ 
      message: 'Product review created successfully!', 
      review: newReview,
      updatedProduct: {
        averageRating: product?.averageRating || 0,
        totalRatings: product?.totalRatings || 0
      }
    });
  } catch (error) {
    console.error('Error creating product review:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// GET route to retrieve ALL reviews
productReviewRouter.get('/product-review', async (req, res) => {
  try {
    const ProductReview = require('../models/product_review');

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

// GET route to retrieve reviews by a specific buyer (MORE SPECIFIC ROUTE FIRST)
productReviewRouter.get('/product-review/buyer/:buyerId', async (req, res) => {
  try {
    const ProductReview = require('../models/product_review');
    
    const { buyerId } = req.params;
    console.log('Fetching reviews for buyer ID:', buyerId);
    
    // Find all reviews by this specific buyer
    const reviews = await ProductReview.find({ buyerId: buyerId });
    
    console.log(`Found ${reviews.length} reviews by buyer: ${buyerId}`);
    
    res.status(200).json({ 
      message: 'Buyer reviews fetched successfully',
      buyerId: buyerId,
      count: reviews.length,
      reviews: reviews
    });
  } catch (error) {
    console.error('Error fetching buyer reviews:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// GET route to retrieve reviews for a specific product by productId
productReviewRouter.get('/product-review/:productId', async (req, res) => {
  try {
    const ProductReview = require('../models/product_review');
    
    const { productId } = req.params;
    console.log('Fetching reviews for product ID:', productId);
    
    // Find all reviews for this specific product
    const reviews = await ProductReview.find({ productId: productId });
    
    console.log(`Found ${reviews.length} reviews for product: ${productId}`);
    
    res.status(200).json({ 
      message: 'Product reviews fetched successfully',
      productId: productId,
      count: reviews.length,
      reviews: reviews
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// DELETE route to delete a specific review
productReviewRouter.delete('/product-review/:reviewId', async (req, res) => {
  try {
    const ProductReview = require('../models/product_review');
    
    const { reviewId } = req.params;
    console.log('Attempting to delete review ID:', reviewId);
    
    const deletedReview = await ProductReview.findByIdAndDelete(reviewId);
    
    if (!deletedReview) {
      return res.status(404).json({ 
        message: 'Review not found' 
      });
    }
    
    console.log('Review deleted successfully:', reviewId);
    
    res.status(200).json({ 
      message: 'Review deleted successfully',
      deletedReview: deletedReview
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

module.exports = productReviewRouter;