require('dotenv').config();
const { connectDb } = require('../db');
const Admin = require('../models/Admin');

async function fixAdmin() {
  try {
    await connectDb();
    console.log('✅ Connected to MongoDB\n');

    const email = 'tkhushi0519@gmail.com';
    const uid = 'h4cypJqw9jYpEB3Qe3bdoobHMDh2';

    // Check if already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists, updating UID...');
      existing.uid = uid;
      existing.isActive = true;
      await existing.save();
    } else {
      const admin = new Admin({
        email,
        uid,
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('✅ Admin created!');
    }

    console.log(`\n✅ ${email} is now an admin!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAdmin();
