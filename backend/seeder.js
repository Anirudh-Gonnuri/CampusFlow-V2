const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Event.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt);

        const users = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@campus.edu',
                password: hashedPassword,
                role: 'ADMIN',
                department: 'Administration'
            },
            {
                name: 'Alex Rivera',
                email: 'alex.rivera@campus.edu',
                password: hashedPassword,
                role: 'ORGANIZER',
                department: 'Computer Science'
            },
            {
                name: 'Jamie Chen',
                email: 'jamie.chen@campus.edu',
                password: hashedPassword,
                role: 'STUDENT',
                department: 'Mechanical Engineering'
            }
        ]);

        const adminUser = users[0]._id;
        const organizerUser = users[1]._id;

        const events = await Event.insertMany([
            {
                title: 'TechNova 2024',
                description: 'The annual tech symposium of our university.',
                date: new Date('2024-11-15'),
                location: 'Main Auditorium',
                organizer: organizerUser,
                category: 'Technology',
                status: 'PUBLISHED',
                imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000',
                modules: []
            },
            {
                title: 'Cultural Fest 2024',
                description: 'Music, dance, and art celebration.',
                date: new Date('2024-12-01'),
                location: 'University Grounds',
                organizer: adminUser,
                category: 'Cultural',
                status: 'DRAFT',
                imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000',
                modules: []
            }
        ]);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Event.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
