require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = new User({
    name: 'Admin',
    email: 'admin@skillnest.com',
    password: hashedPassword,
    role: 'admin'
  });
  await admin.save();
  console.log('Admin created! Email: admin@skillnest.com | Password: admin123');
  mongoose.connection.close();
}).catch(err => console.log(err));
