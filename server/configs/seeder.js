const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@dreamarena.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const admin = new User({
                name: 'Super Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Default Admin user created: admin@dreamarena.com');
        }

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
            console.log('✅ Mock Admin user created: admin@gmail.com');
        }
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
    }
};

module.exports = seedAdmin;
