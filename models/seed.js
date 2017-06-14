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
const exerciseThreeID = new ObjectID();
const exerciseFourID = new ObjectID();
const exerciseFiveID = new ObjectID();




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
  name: 'Seated barbell press',
  description: 'Sit on the bench holding a barbell in front of your shoulders with an overhand grip. Press the weight up above your head until your arms are fully extended. Return slowly to the start position.',
  image: 'http://assets.menshealth.co.uk/main/assets/sitbb1.gif?mtime=1432138595',
}, {
  _id : exerciseTwoID,
  name: 'Inverted rows',
  description: 'Set up a bar in a rack at waist height. Hold it at shoulder-width, with an underhand grip, and hang underneath. Position yourself with heels out in front of you and arms fully extended. Your body should be straight from shoulders to ankles. Flex at the elbows to pull your chest up to the bar. Lower yourself back to the start position under control.',
  image: 'http://assets.menshealth.co.uk/main/assets/invertedrow.gif?mtime=1432138595',
}, {
  _id : exerciseThreeID,
  name: 'Cable flys',
  description: 'Attach stirrup handles to the high pulleys of a cable crossover machine. Take one in each hand – your arms should be outstretched with a slight bend at the elbow. Place one foot slightly forward, brace you core, and pull the handles slightly downward and across your body until your hands meet, then slowly return to the start position.',
  image: 'http://assets.menshealth.co.uk/main/assets/cabley.gif?mtime=1432138937',
},{
  _id : exerciseFourID,
  name: 'Bulgarian split squat',
  description: 'Holding a dumbbell in each hand, stand facing away from a bench with one leg resting on it, laces down. Squat down with your standing leg until the knee of your trailing leg almost touches the floor. Push up through your front foot to return to the start position.',
  image: 'http://assets.menshealth.co.uk/main/assets/splitty.gif?mtime=1432138990',
},{
  _id : exerciseFiveID,
  name: 'Dumbbell bench press',
  description: 'Lie down on a flat bench with a dumbbell in each hand, holding them in front of your shoulders. Breathe out and use your chest to push the dumbbells up, straightening your arms. Pause for a second with your arms fully extended and then return under control to the start position.',
  image: 'http://assets.menshealth.co.uk/main/assets/flatbench.gif?mtime=1432138593',
},];

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
    var exercise3 = new Exercise(exercises[2]).save();
    var exercise4 = new Exercise(exercises[3]).save();
    var exercise5 = new Exercise(exercises[4]).save();

    return Promise.all([exercise1, exercise2, exercise3, exercise4, exercise5]);
  });
};
