const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = {Exercise};
