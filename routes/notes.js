const express = require('express')
const notes = express.Router();
const fs = require('fs')
const db = require('../db/db.json')
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtiles');
const uuid = require('../helpers/uuid');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
     id: uuid(),
    };
    
    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

// DELETE Route for deleting note from db
notes.delete('/:id', (req, res) => {
    const { id } = req.params
    const noteToDelete = db.find(noteEl => noteEl.id === id)
    const index = db.indexOf(noteToDelete);
    db.splice(index, 1)

    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
        res.status(204).json({
            status: "success",
        })
    } )
    
    
    
  });

module.exports = notes;