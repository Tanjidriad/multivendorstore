const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  productPrice: { type: Number, required: true },
  quantity: { type: Number, required: true }, // Changed from String to Number
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  vendorId:{type: String, required: true},
  fullName:{type: String, required: true},
  subCategory: { type: String, required: true },
  images: [{ type: String, required: true }],
  popular: { type: Boolean, default: false }, // Changed from 'new' to 'popular' with default false
  recommended: { type: Boolean, default: false }, // Changed default from true to false

  //add this fields for reviews
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
