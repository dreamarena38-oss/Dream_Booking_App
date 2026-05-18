const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    type: { type: String, enum: ['text', 'image', 'video'], required: true },
    content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
