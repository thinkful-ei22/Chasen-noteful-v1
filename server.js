'use strict';

// Load array of notes
// const data = require('./db/notes');
// const simDB = require('./db/simDB'); 
// const notes = simDB.initialize(data);

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');
const morgan = require('morgan');

const { PORT } = require('./config');
const notesRouter = require('./router/notes.router');
// const logger = require('./middleware/logger');

const app = express();

//log all requests///
app.use(morgan('dev'));

// app.use(logger);
app.use(express.static('public'));
//parse incoming req that contain JSON and make them available on req.body///
app.use(express.json());
//mouting router on /api ////
app.use('/api', notesRouter);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;


