const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abc123',
    database: 'scrabblepoints_db'
  });
const fs = require('fs');

con.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
      }
    
      console.log('Connected to the MySQL server.');
});

app.post('/api/save-score', (req, res) => {
    console.log(`[Save Score API] ${req.body}`)
    const score = req.body.score;
    const scrabbleWord= req.body.scrabble_word;
    const sql = 'INSERT INTO scores_and_words (score, scrabble_word) VALUES (?, ?)';
    con.query(sql, [score,scrabbleWord], (err) => {
      if (err) {
        console.log(err)
        if (err.code === 'ER_DUP_ENTRY') {
          // Handle the case when the scrabble word already exists in the table
          console.error('Duplicate entry for scrabble word:', scrabbleWord);
          res.sendStatus(409); // Conflict - HTTP status code for duplicate entry
        } else{
        console.error('Error saving score and scrabble words:', err);
        res.sendStatus(500);
        }
      } else {
        res.sendStatus(200); // Success
      }
    });
  });
  
  app.get('/api/top-scores', (req, res) => {
    const sql = 'SELECT * FROM scores_and_words ORDER BY score DESC LIMIT 10';
    con.query(sql, (err, results) => {
      console.log(`[Top Score API] ${results}`)
      if (err) {
        console.error('Error fetching top scores:', err);
        res.sendStatus(500);
        return;
      }
      res.json(results);
    });
  });
  
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});