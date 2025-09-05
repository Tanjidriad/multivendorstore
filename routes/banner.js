const express = require('express');
const Banner = require('../models/banner'); // Importing the Banner model
const BannerRouter = express.Router();

BannerRouter.post('/banners', async (req, res) => {
  try {
   const {image} = req.body;
   const newBanner = new Banner({
     image
   });
   await newBanner.save();
   res.status(201).json({ message: 'Banner created successfully!', banner: newBanner });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to retrieve all banners
BannerRouter.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = BannerRouter;
  