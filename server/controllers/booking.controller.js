const Booking = require('../models/Booking');
const Ground = require('../models/Ground');

exports.createBooking = async (req, res) => {
    try {
        const { groundId, date, time } = req.body;

        // Check if slot is already booked
        const existingBooking = await Booking.findOne({ ground: groundId, date, time, status: 'confirmed' });
        if (existingBooking) {
            return res.status(400).json({ message: 'This slot is already booked' });
        }

        const booking = new Booking({
            ground: groundId,
            user: req.user._id,
            date,
            time
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('ground');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('ground').populate('user', 'name email');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
