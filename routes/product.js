const express = require('express');
const productRouter = express.Router();

productRouter.post('/add-product', async (req, res) => {
  try {
    // Import Product model inside the route to avoid circular dependency
    const Product = require('../models/product');
    
    console.log('Request body:', req.body); // Debug log
    
    const { 
      productName, 
      description, 
      productPrice, 
      quantity, 
      imageUrl, 
      category, 
      subCategory, 
      images, 
      popular, 
      recommended,
      vendorId,    // ✅ Add these missing fields
      fullName     // ✅ Add these missing fields
    } = req.body;

    // Validate required fields
    if (!productName || !description || !productPrice || !quantity || !imageUrl || !category || !subCategory || !vendorId || !fullName) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['productName', 'description', 'productPrice', 'quantity', 'imageUrl', 'category', 'subCategory', 'vendorId', 'fullName']
      });
    }

    // Create a new product instance
    const newProduct = new Product({
      productName,
      description,
      productPrice: Number(productPrice),
      quantity: Number(quantity),
      imageUrl,
      category,
      vendorId,
      fullName,
      subCategory,
      images: images || [imageUrl], // Default to imageUrl if images array not provided
      popular: popular !== undefined ? popular : false,
      recommended: recommended !== undefined ? recommended : false
    });

    // Save the product to the database
    await newProduct.save();
    res.status(201).json({ 
      message: 'Product created successfully!', 
      product: newProduct 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// GET route to retrieve popular products
productRouter.get('/popular-products', async (req, res) => {
    try {
        const Product = require('../models/product');
        
        console.log('Searching for popular products...'); // Debug log
        const products = await Product.find({ popular: true });
        console.log('Found products:', products.length); // Debug log
        
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No popular products found' });
        } else {
            return res.status(200).json({ 
                message: 'Popular products fetched successfully',
                count: products.length,
                products 
            });
        }
    } catch (error) {
        console.error('Error fetching popular products:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

// GET route to retrieve ALL products
productRouter.get('/all-products', async (req, res) => {
    try {
        const Product = require('../models/product');
        
        const products = await Product.find();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        } else {
            return res.status(200).json({ 
                message: 'All products fetched successfully',
                count: products.length,
                products 
            });
        }
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

// GET route to retrieve recommended products
productRouter.get('/recommended-products', async (req, res) => {
    try {
        const Product = require('../models/product');
        
        console.log('Searching for recommended products...'); // Debug log
        const products = await Product.find({ recommended: true });
        console.log('Found recommended products:', products.length); // Debug log
        
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No recommended products found' });
        } else {
            return res.status(200).json({ 
                message: 'Recommended products fetched successfully',
                count: products.length,
                products 
            });
        }
    } catch (error) {
        console.error('Error fetching recommended products:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

productRouter.get('/products-by-category/:category', async (req, res) => {
    console.log('Products by category route hit!'); // Debug log
    try {
        const Product = require('../models/product');
        const category = req.params.category;

        console.log(`Fetching products for category: ${category}`); // Debug log
        const products = await Product.find({ category: category, popular: true });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        } else {
            return res.status(200).json({ 
                message: 'Products fetched successfully',
                count: products.length,
                products 
            });
        }
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
});

module.exports = productRouter;