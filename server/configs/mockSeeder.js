const mongoose = require('mongoose');
const User = require('../models/User');
const Team = require('../models/Team');
const Ground = require('../models/Ground');
const League = require('../models/League');
const News = require('../models/News');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

const seedMockData = async () => {
    try {
        console.log('🌱 Starting mock data seeding...');

        // 1. Clear existing data (optional - comment out if you want to keep existing data)
        // await Team.deleteMany({});
        // await Ground.deleteMany({});
        // await League.deleteMany({});
        // await News.deleteMany({});
        // await Booking.deleteMany({});
        // await Review.deleteMany({});

        // 2. Seed News
        const newsCount = await News.countDocuments();
        if (newsCount === 0) {
            await News.insertMany([
                { type: 'text', content: 'Welcome to Dream Arena! We are excited to announce our new league starting next month.' },
                { type: 'image', content: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg' },
                { type: 'text', content: 'Congratulations to "Strikers FC" for winning the Summer Cup!' },
                { type: 'image', content: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg' }
            ]);
            console.log('✅ News seeded');
        }

        // 3. Seed Grounds
        const groundCount = await Ground.countDocuments();
        let ground1, ground2;
        if (groundCount === 0) {
            [ground1, ground2] = await Ground.insertMany([
                {
                    name: 'Elite Turf Center',
                    location: 'Downtown Sports Complex',
                    size: '11v11',
                    pricePerHour: 120,
                    image: 'https://images.pexels.com/photos/61143/pexels-photo-61143.jpeg',
                    features: ['Floodlights', 'Changing Rooms', 'Water Stations', 'Parking'],
                    isAvailable: true
                },
                {
                    name: 'Sunset Arena',
                    location: 'Coastal Road',
                    size: '7v7',
                    pricePerHour: 80,
                    image: 'https://images.pexels.com/photos/364308/pexels-photo-364308.jpeg',
                    features: ['Cafe', 'Artificial Grass', 'Bibs Provided'],
                    isAvailable: true
                }
            ]);
            console.log('✅ Grounds seeded');
        } else {
            const grounds = await Ground.find().limit(2);
            ground1 = grounds[0];
            ground2 = grounds[1];
        }

        // 4. Seed Teams
        const teamCount = await Team.countDocuments();
        let team1, team2;
        if (teamCount === 0) {
            [team1, team2] = await Team.insertMany([
                {
                    name: 'Strikers FC',
                    captain: 'John Doe',
                    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Strikers',
                    password: 'password123',
                    matchesPlayed: 10,
                    wins: 8
                },
                {
                    name: 'Blue Phoenix',
                    captain: 'Jane Smith',
                    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Phoenix',
                    password: 'password123',
                    matchesPlayed: 10,
                    wins: 5
                }
            ]);
            console.log('✅ Teams seeded');
        } else {
            const teams = await Team.find().limit(2);
            team1 = teams[0];
            team2 = teams[1];
        }

        // 5. Seed Leagues
        const leagueCount = await League.countDocuments();
        if (leagueCount === 0) {
            await League.insertMany([
                {
                    name: 'Dream Premier League',
                    description: 'The ultimate competition for professional teams.',
                    startDate: new Date(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    status: 'active',
                    teams: [team1?._id, team2?._id].filter(id => id)
                },
                {
                    name: 'Junior Stars Cup',
                    description: 'A platform for upcoming youngsters.',
                    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
                    status: 'inactive',
                    teams: []
                }
            ]);
            console.log('✅ Leagues seeded');
        }

        console.log('🌳 Mock data seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding mock data:', error.message);
    }
};

module.exports = seedMockData;
