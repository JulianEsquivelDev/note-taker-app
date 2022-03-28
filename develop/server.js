// use require to call our npm package "express"
const express = require('express');
// instantiate the server
const app = express();
// identify PORT so it can be connected to Heroku 
const PORT = process.env.PORT || 3001;
// require path to load html on the server
const path = require('path');
// require fs to access all fs methods that are preinstalled in node.js
const fs = require('fs');
//
const eachNote = require('./db/db.json');
// use app.use to grab css and javascript from the front-end developers folder
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/notes', (req, res) => {
    res.json (eachNote.slice(1));
});

// use app.get to send index.html file to the 3001 server to be presented on the page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
// since this is our second route we need to identify it since its not an api and its an HTML page. We called "/notes" instead of just "/".
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
// use "*" instead of "/" incase of pathing errors
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// function to create new note
function generateNote(body, newNotes) {
    const newInput = body;
    if (!Array.isArray(newNotes))
        newNotes = [];
    if(newNotes.length === 0)
    // Array.push
    newNotes.push(0);

    body.id = newNotes[0];
    newNotes[0]++;

    newNotes.push(newInput);
    fs.writeFileSync(
        // method
        path.join(__dirname, './db/db.json'),
        JSON.stringify(newNotes, null, 2)

    );
    return newInput;
}
//
app.post('/api/notes', (req, res) => {
    const newInput = generateNote(req.body, eachNote);
    res.json(newInput);
});
// function to remove users notes
function removeNewNote(id, newNotes) {
    for (let i = 0; i < newNotes.length; i++) {
        let input = newNotes[i];
        if (input.id == id) {
            newNotes.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(newNotes, null, 2)

            );
            break;
        }
    }
}
// use app.delete from express (HTTP DELETE request)
app.delete('/api/notes/:id', (req, res) => {
    removeNewNote(req.params.id, eachNote);
    // confirm function with JSON response
    res.json(true);
});

// make server listen
app.listen(PORT, () => {
    console.log('API server now on port ${PORT}.');
});

// test to see if server is working
//app.get('/', (req, res) => {
//    res.send('Hello Julian.')
//})

