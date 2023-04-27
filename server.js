const path = require('path');
const express = require('express');
const app = express();
const homePageRouter = require('./routes/homepage');
const notesRouter = require('./routes/notes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(homePageRouter);  
app.use(notesRouter);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
