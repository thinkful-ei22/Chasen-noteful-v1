'use strict';

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB'); 
const notes = simDB.initialize(data);

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');
const { PORT } = require('./config');
const logger = require('./middleware/logger');

const app = express();

app.use(logger);
app.use(express.static('public'));
//parse incoming req that contain JSON and make them available on req.body
app.use(express.json());

// app.get('/api/notes', (req, res) => {
//   const queryTerm = req.query.searchTerm;
//   if (queryTerm){
//     const filteredNotes = data.filter(item => item.title.includes(queryTerm));
//     res.json(filteredNotes);
//   }else{
//     res.json(data);
//   }
// });

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

// app.get('/api/notes/:id', (req, res) =>{
//   const id = req.params.id;
//   res.json(data.find(item => item.id === Number(id)));
// });

app.get('/api/notes/:id', (req, res, next) => {
  const {id} = req.params;  //same thing as req.params.id
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } 
    else {
      next();
    }
  });
});

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
 
  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});


app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

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

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


