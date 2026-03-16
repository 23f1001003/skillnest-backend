const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  instructor: { type: String, required: true },
  duration: { type: String },
  rating: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  image: { type: String, default: '' },
  status: { type: String, enum: ['published', 'draft'], default: 'published' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);