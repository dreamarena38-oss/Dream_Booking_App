const express = require('express');
const router = express.Router();
const groundController = require('../controllers/ground.controller');
const { auth, admin } = require('../middleware/auth.middleware');

router.get('/', groundController.getAllGrounds);
router.get('/:id', groundController.getGroundById);
router.post('/', auth, admin, groundController.createGround);
router.put('/:id', auth, admin, groundController.updateGround);
router.delete('/:id', auth, admin, groundController.deleteGround);
router.get('/:id/reviews', groundController.getGroundReviews);
router.post('/:id/reviews', auth, groundController.addReview);

module.exports = router;
