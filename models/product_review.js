const mongoose = require("mongoose");

const productReviewSchema = new mongoose.Schema({
  buyerId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  fullName: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    // min: 1,
    // max: 5
  },
  review: {
    type: String,
    required: true,
  },
});

const productReview = mongoose.model("ProductReview", productReviewSchema);

module.exports = productReview;