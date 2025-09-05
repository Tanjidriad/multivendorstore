const express = require('express');
const helloRouter = require('./routes/hello');  // Importing the helloRouter
const mongoose = require('mongoose');
const Authrouter = require('./routes/auth'); // Importing the Authrouter
const BannerRouter = require('./routes/banner'); // Importing the BannerRouter
const categoryRouter = require('./routes/category'); // Importing the categoryRouter (fixed casing)  
const subCategoryRouter = require('./routes/sub_category'); // Importing the subCategoryRouter
const productRouter = require('./routes/product'); // Importing the productRouter (FIXED)
const productReviewRouter = require('./routes/product_review'); // Importing the productReviewRouter (FIXED)
const vendorRouter = require('./routes/vendor'); // Importing the vendorRouter
const orderRouter = require('./routes/order'); // Importing the orderRouter
const cors = require('cors'); // Importing CORS for handling cross-origin requests

const PORT = 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces
const app = express();
// Replace 'username' and 'password' with your actual MongoDB Atlas credentials
const DB = "mongodb+srv://19202103530:QVdQtnHNvPcMSpjp@multivendor.lyfd6v3.mongodb.net/?retryWrites=true&w=majority&appName=multivendor"

app.use(express.json()); // Middleware to parse JSON bodies

// CORS configuration for Flutter web app
app.use(cors({
  origin: true,  // Allow all origins (use only in development!)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});
app.use('/api', Authrouter);
app.use('/api', BannerRouter); // Use the BannerRouter for banner-related routes
app.use('/api', categoryRouter); // Use the categoryRouter for category-related routes (fixed casing)
app.use('/hello', helloRouter);
app.use('/api', subCategoryRouter); // Use the subCategoryRouter for subcategory-related routes
app.use('/api', productRouter); // Use the productRouter for product-related routes
app.use('/api', productReviewRouter); // Use the productReviewRouter for product review-related routes
app.use('/api', vendorRouter); // Use the vendorRouter for vendor-related routes
app.use('/api', orderRouter); // Use the orderRouter for order-related routes

mongoose.connect(DB).then(() => {
  console.log('Connected to MongoDB');
  // Start the server only after MongoDB connection is established
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on:`);
    console.log(`- Local: http://localhost:${PORT}`);
    console.log(`- Network: http://0.0.0.0:${PORT}`);
    console.log(`- For emulator: Use http://10.0.2.2:${PORT}`);
    console.log(`- For physical device: Use your computer's IP address`);
  });      
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);   
});