const mongoose = require('mongoose');

const AllUserSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}, { collection: 'Users' });

module.exports = mongoose.model("Users", AllUserSchema);