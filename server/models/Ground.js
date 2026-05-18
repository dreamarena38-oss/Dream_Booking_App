const mongoose = require('mongoose');

const groundSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    size: { type: String, required: true }, // e.g., '11v11', '7v7'
    pricePerHour: { type: Number, required: true },
    image: { type: String },
    features: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Ground', groundSchema);
