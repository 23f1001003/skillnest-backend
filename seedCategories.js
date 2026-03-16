require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Category.deleteMany({});
  await Category.insertMany([
    { name: 'Web Dev' },
    { name: 'Design' },
    { name: 'Data' },
    { name: 'Marketing' }
  ]);
  console.log('Categories seeded!');
  mongoose.connection.close();
}).catch(err => console.log(err));