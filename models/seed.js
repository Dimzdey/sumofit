const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

const {User} = require('./User');
const {Ad} = require('./Ads');
const {Exercise} = require('./Exercises');
const {Workout} = require('./Workout');


const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const userThreeID = new ObjectID();

const adOneID = new ObjectID();
const adTwoID = new ObjectID();
const adThreeID = new ObjectID();

const exerciseOneID = new ObjectID();
const exerciseTwoID = new ObjectID();

const users =
[{
    _id: userOneID,
    local: {
      email: 'alex@test.test',
      password: 'userOnePassword',
      username: 'Coach 1'
    },
    online: false
}, {
    _id: userTwoID,
    local: {
      email: 'test@test.test',
      password: 'test',
      username: 'Coach 2'
    },
    online: false

}, {
    _id: userThreeID,
    local: {
      email: 'peter@test.test',
      password: 'userThreePassword',
      username: 'Coach 3'
    },
    online: false

}];

const exercises = [{
  _id : exerciseOneID,
  name: 'Back',
  description: 'Stronk',
  image: 'Test',
}, {
  _id : exerciseTwoID,
  name: 'Front',
  description: 'desc',
  image: 'image',
}];

const workouts = {
  _id : new ObjectID(),
  _creator : userOneID,
  exercises: [{
    _exercise : exerciseOneID,
    turns: 10,
    reiterations: 20
  }]
};




module.exports.ex = () => {
  Exercise.remove({}).then(() => {
    var exercise1 = new Exercise(exercises[0]).save();
    var exercise2 = new Exercise(exercises[1]).save();
    return Promise.all([exercise1, exercise2]);
  });
};
