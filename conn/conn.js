
const mongoose = require('mongoose');
require('dotenv').config();

const conn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(process.env.MONGO_URI);
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
    }
};

conn();

module.exports = conn;

