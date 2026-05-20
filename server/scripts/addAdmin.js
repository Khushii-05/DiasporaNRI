require('dotenv').config();
const readline = require('readline');
const { connectDb } = require('../db');
const Admin = require('../models/Admin');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function addAdmin() {
  try {
    await connectDb();
    console.log('✅ Connected to MongoDB\n');

    const email = await prompt('Enter admin email: ');
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email');
      process.exit(1);
    }

    const uid = await prompt('Enter Firebase UID (or press Enter to skip): ');

    // Check if admin already exists
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.error('❌ Admin with this email already exists');
      process.exit(1);
    }

    // Create admin
    const admin = new Admin({
      email: email.toLowerCase(),
      uid: uid || null,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('\n✅ Admin created successfully!');
    console.log('   Email:', admin.email);
    console.log('   UID:', admin.uid || '(Firebase UID will be linked after first login)');
    console.log('\n👉 Now login at http://localhost:5173/admin-login with this email');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

addAdmin();
