const express = require('express');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');
const config = require('./config/db');
const logger = require('./utils/logger');

mongoose.Promise = global.Promise;
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
  console.log('connected to database: ' + config.database);
});

mongoose.connection.on('error', (err) => {
  console.log('Error: ' + err);
});

const app = express();
const port = 3000;

app.use(express.static(__dirname + '/apidoc'));

logger.debug("Overriding 'Express' logger");
app.use(require('morgan')('combined', { "stream": logger.stream }));

//router middleware
const users = require('./routes/users');
const api = require('./routes/api');

//bodyparser middleware
app.use(bodyParser.json());
//TODO: change limit
app.use(bodyParser.raw({
  limit: '10mb'
}));

//CORS middleware (cross origin requests)
app.use(cors());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//routes
app.use('/users', users);
app.use('/api', api);

app.listen(port, ()=>{
  console.log('Server started listen on port: ' + port);
});
