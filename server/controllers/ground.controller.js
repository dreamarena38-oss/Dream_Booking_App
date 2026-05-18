const Ground = require('../models/Ground');
const Review = require('../models/Review');

exports.getAllGrounds = async (req, res) => {
    try {
        const grounds = await Ground.find();
        res.json(grounds);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getGroundById = async (req, res) => {
    try {
        const ground = await Ground.findById(req.params.id);
        if (!ground) {
            return res.status(404).json({ message: 'Ground not found' });
        }
        res.json(ground);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createGround = async (req, res) => {
    try {
        const ground = new Ground(req.body);
        await ground.save();
        res.status(201).json(ground);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateGround = async (req, res) => {
    try {
        const ground = await Ground.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ground) {
            return res.status(404).json({ message: 'Ground not found' });
        }
        res.json(ground);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteGround = async (req, res) => {
    try {
        const ground = await Ground.findByIdAndDelete(req.params.id);
        if (!ground) {
            return res.status(404).json({ message: 'Ground not found' });
        }
        res.json({ message: 'Ground deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getGroundReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ ground: req.params.id }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const groundId = req.params.id;

        const review = new Review({
            ground: groundId,
            user: req.user._id,
            rating,
            comment
        });

        await review.save();

        // Update ground average rating
        const reviews = await Review.find({ ground: groundId });
        const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        await Ground.findByIdAndUpdate(groundId, {
            averageRating,
            reviewCount: reviews.length
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
