const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },

  state: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
    trim: true,
  },

  locality: {
    type: String,
    default: "",
    trim: true,
  },


   role: {
    type: String,
    default: "vendor",
    trim: true,
  },


  password: {
    type: String,
    required: true,
    // Remove length validation since we'll hash the password
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
