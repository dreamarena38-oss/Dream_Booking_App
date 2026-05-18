const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { auth, admin } = require('../middleware/auth.middleware');

router.get('/stats', auth, admin, adminController.getStats);

module.exports = router;
