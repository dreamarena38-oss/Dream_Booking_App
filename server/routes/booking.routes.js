const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { auth, admin } = require('../middleware/auth.middleware');

router.post('/', auth, bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getUserBookings);
router.get('/', auth, admin, bookingController.getAllBookings);
router.delete('/:id', auth, admin, bookingController.deleteBooking);

module.exports = router;
