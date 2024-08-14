const mongoose = require("mongoose");
const book = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  { timesStamp: true }
);
  
module.exports = mongoose.model("book", book);
