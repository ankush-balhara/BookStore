const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg",
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
    },
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('user', user);
