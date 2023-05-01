const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();


router.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            res.json(parsedData);
        }
    });
});

router.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    let newNote;
    if(req.body) {
        newNote = {
            title,
            text,
            id: Math.floor(Math.random() * 1000),
        }
        console.log(newNote);
    }

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(parsedData), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Note added!');
                }
            });
        }
    });
});

// DELETE requests
router.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    
    let notes = JSON.parse(fs.readFileSync('./db/db.json'));
    notes = notes.filter((note) => note.id !== id);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  
    res.json(notes);
  });

module.exports = router;