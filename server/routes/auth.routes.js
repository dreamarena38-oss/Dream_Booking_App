const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth, admin } = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, authController.updateProfile);
router.get('/users', auth, admin, authController.getUsers);
router.delete('/users/:id', auth, admin, authController.deleteUser);
router.delete('/account/:id', auth, authController.deleteUser);

module.exports = router;

