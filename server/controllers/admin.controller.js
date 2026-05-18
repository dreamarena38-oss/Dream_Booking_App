const User = require('../models/User');
const Team = require('../models/Team');
const Ground = require('../models/Ground');
const Booking = require('../models/Booking');

exports.getStats = async (req, res) => {
    try {
        const [totalUsers, totalTeams, totalGrounds, totalBookings] = await Promise.all([
            User.countDocuments({ role: { $ne: 'admin' } }),
            Team.countDocuments(),
            Ground.countDocuments(),
            Booking.countDocuments({ status: 'confirmed' })
        ]);

        res.json({
            totalUsers,
            totalTeams,
            totalGrounds,
            totalBookings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
