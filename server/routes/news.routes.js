const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const { auth, admin } = require('../middleware/auth.middleware');

router.get('/', newsController.getAllNews);
router.post('/', auth, admin, newsController.createNews);
router.put('/:id', auth, admin, newsController.updateNews);
router.delete('/:id', auth, admin, newsController.deleteNews);

module.exports = router;
