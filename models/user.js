const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
      message: (props) => `${props.value} is not a valid email!`
    }
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

  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {       
        return v.length >= 6;
      },
      message: (props) => `${props.value} is not a valid password!`
    }
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
