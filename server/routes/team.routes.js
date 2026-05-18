const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { auth, admin } = require('../middleware/auth.middleware');

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/', auth, admin, teamController.createTeam);
router.put('/:id', auth, admin, teamController.updateTeam);
router.delete('/:id', auth, admin, teamController.deleteTeam);

module.exports = router;
