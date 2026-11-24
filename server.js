const express = require('express');
const fs = require('fs');
const app = express();

// allow express to read json data sent from the frontend
app.use(express.json());

// serve the public folder (where index.html is)
app.use(express.static('public'));

// check if database file exists. if not, make a starting one.
if (fs.existsSync('database.json') == false) {
    let startingData = {
        questions: [
            { q: "1. Which symbol ends a statement in C++?", options: ["Colon (:)", "Semicolon (;)", "Period (.)", "Comma (,)"], correct: 1 },
            { q: "2. Which logic gate outputs 1 only when all inputs are 1?", options: ["OR Gate", "NOT Gate", "AND Gate", "XOR Gate"], correct: 2 }
        ],
        scores: []
    };
    // create the file
    fs.writeFileSync('database.json', JSON.stringify(startingData, null, 2));
    console.log("New database file created!");
}

// API 1: send questions to the student page
app.get('/api/questions', (req, res) => {
    // step 1: read the file
    let rawData = fs.readFileSync('database.json');
    let db = JSON.parse(rawData);
    
    // step 2: send only the questions to the frontend
    res.json(db.questions);
});

// API 2: save the student score
app.post('/api/save-score', (req, res) => {
    // step 1: read the current database
    let rawData = fs.readFileSync('database.json');
    let db = JSON.parse(rawData);

    // step 2: add the new score from frontend into our list
    db.scores.push({
        name: req.body.name,
        roll: req.body.roll,
        score: req.body.score
    });

    // step 3: save it back to the file permanently
    fs.writeFileSync('database.json', JSON.stringify(db, null, 2));
    console.log("Saved new score for: " + req.body.name);

    res.json({ message: "Score saved successfully!" });
});

// API 3: teacher adds a new question
app.post('/api/add-question', (req, res) => {
    // step 1: read the current database
    let rawData = fs.readFileSync('database.json');
    let db = JSON.parse(rawData);

    // step 2: push the new question into the array
    db.questions.push(req.body);

    // step 3: save it back to the file
    fs.writeFileSync('database.json', JSON.stringify(db, null, 2));
    console.log("Teacher added a new question!");

    res.json({ message: "Question added!" });
});

// API 4: send scores to the teacher's table
app.get('/api/scores', (req, res) => {
    // read the file
    let rawData = fs.readFileSync('database.json');
    let db = JSON.parse(rawData);
    
    // send the scores
    res.json(db.scores);
});

// start the server on port 3000
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
}); 