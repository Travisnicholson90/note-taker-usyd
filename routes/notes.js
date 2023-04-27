const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

router.post('/api/notes', (req, res) => {
    console.log(req.body);
})

module.exports = router;