const express = require('express');
const router = express.Router();
const leagueController = require('../controllers/league.controller');
const { auth, admin } = require('../middleware/auth.middleware');

router.get('/', leagueController.getAllLeagues);
router.get('/:id', leagueController.getLeagueById);
router.post('/', auth, admin, leagueController.createLeague);
router.put('/:id', auth, admin, leagueController.updateLeague);
router.delete('/:id', auth, admin, leagueController.deleteLeague);
router.post('/:id/join', auth, leagueController.joinLeague);

module.exports = router;
