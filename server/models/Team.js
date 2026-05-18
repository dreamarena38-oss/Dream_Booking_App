const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    captain: { type: String, required: true }, // Name of the captain
    logo: { type: String },
    password: { type: String }, // Password to join the team
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    leagues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'League' }],
    matchesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
