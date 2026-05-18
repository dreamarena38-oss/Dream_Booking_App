const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding');

        const adminEmail = 'admin@dreamarena.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            const admin = new User({
                name: 'Super Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin'
            });

            await admin.save();
            console.log('Admin user created successfully');
        }

        // Also create the mock admin mentioned in frontend if needed
        const mockAdminEmail = 'admin@gmail.com';
        const existingMockAdmin = await User.findOne({ email: mockAdminEmail });
        if (!existingMockAdmin) {
            const mockAdmin = new User({
                name: 'Mock Admin',
                email: mockAdminEmail,
                password: 'admin',
                role: 'admin'
            });
            await mockAdmin.save();
            console.log('Mock admin user created successfully');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
