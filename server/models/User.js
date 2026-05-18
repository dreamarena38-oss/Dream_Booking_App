const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer', 'team'], default: 'customer' },
    height: { type: String },
    position: { type: String },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    profileImage: { type: String },
    phone: { type: String },
    address: { type: String },
    weight: { type: String },
    currentLeague: { type: mongoose.Schema.Types.ObjectId, ref: 'League' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
