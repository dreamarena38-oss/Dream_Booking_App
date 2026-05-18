const League = require('../models/League');
const Team = require('../models/Team');

exports.getAllLeagues = async (req, res) => {
    try {
        const leagues = await League.find().populate('teams', 'name logo');
        res.json(leagues);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getLeagueById = async (req, res) => {
    try {
        const league = await League.findById(req.params.id).populate('teams');
        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }
        res.json(league);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createLeague = async (req, res) => {
    try {
        const league = new League(req.body);
        await league.save();
        res.status(201).json(league);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateLeague = async (req, res) => {
    try {
        const league = await League.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }
        res.json(league);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteLeague = async (req, res) => {
    try {
        await League.findByIdAndDelete(req.params.id);
        res.json({ message: 'League deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.joinLeague = async (req, res) => {
    try {
        const league = await League.findById(req.params.id);
        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }

        // A user can only join if they are a 'team' and have a teamId
        if (req.user.role !== 'team' || !req.user.teamId) {
            return res.status(400).json({ message: 'Only teams can join leagues' });
        }

        // Check if team is already in league
        if (league.teams.includes(req.user.teamId)) {
            return res.status(400).json({ message: 'Team already joined this league' });
        }

        league.teams.push(req.user.teamId);
        await league.save();

        // Update team document
        await Team.findByIdAndUpdate(req.user.teamId, { $push: { leagues: league._id } });

        res.json({ message: 'Joined league successfully', league });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
