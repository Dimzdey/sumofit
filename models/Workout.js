const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  _creator : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  exercises: [{
    _exercise : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Exercise'
    },
    turns: Number,
    reiterations: Number
  }]
});

const Workout = mongoose.model('Workout', WorkoutSchema);
module.exports = {Workout};
