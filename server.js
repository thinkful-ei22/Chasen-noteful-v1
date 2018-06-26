'use strict';

// Load array of notes
const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

const express = require('express');
const { PORT } = require('./config');
const logger = require('./middleware/logger');

const app = express();


app.use(express.static('public'));
app.use(logger);

app.get('/api/notes', (req, res) => {
  const queryTerm = req.query.searchTerm;
  if (queryTerm){
    const filteredNotes = data.filter(item => item.title.includes(queryTerm));
    res.json(filteredNotes);
  }else{
    res.json(data);
  }
});

// app.get('/api/notes/:id', (req, res) => {
//   res.id.json(data[req.params.id]);
// });

app.get('/api/notes/:id', (req, res) =>{
  const id = req.params.id;
  const note = data.find(item => item.id === Number(id));

  res.json(note);
});


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


