require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const TicketClass = require('../models/TicketClass');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parking_system');
  console.log('✅ MongoDB Connected for seeding');
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await TicketClass.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create superadmin
  const superadmin = await User.create({
    username: 'superadmin',
    password: 'admin123',
    role: 'superadmin',
    name: 'Super Admin',
    isActive: true
  });
  console.log('👑 Superadmin created: superadmin / admin123');

  // Create sample operators
  const op1 = await User.create({
    username: 'operator1',
    password: 'op123',
    role: 'operator',
    name: 'Ramesh Kumar',
    isActive: true
  });
  const op2 = await User.create({
    username: 'operator2',
    password: 'op123',
    role: 'operator',
    name: 'Suresh Singh',
    isActive: true
  });
  console.log('👷 Operators created: operator1 / op123, operator2 / op123');

  // Create ticket classes with initial serial numbers
  await TicketClass.create([
    { name: '₹5 Ticket', price: 5, currentSerialNumber: 600, color: '#10B981' },
    { name: '₹10 Ticket', price: 10, currentSerialNumber: 400, color: '#3B82F6' },
    { name: '₹20 Ticket', price: 20, currentSerialNumber: 211, color: '#8B5CF6' },
    { name: '₹100 Ticket', price: 100, currentSerialNumber: 6, color: '#F59E0B' },
  ]);
  console.log('🎟️  Ticket classes created: ₹5, ₹10, ₹20, ₹100');

  console.log('\n✅ Seeding complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Login Credentials:');
  console.log('  Superadmin: superadmin / admin123');
  console.log('  Operator 1: operator1 / op123');
  console.log('  Operator 2: operator2 / op123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  process.exit(0);
};

seedData().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
