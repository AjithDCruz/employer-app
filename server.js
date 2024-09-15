const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML form)
app.use(express.static('public'));

// SQLite database setup
let db = new sqlite3.Database('./employees.db');

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT,
    employee_name TEXT,
    acf2_id TEXT,
    td_mail TEXT,
    wipro_mail TEXT,
    week1 INTEGER,
    week2 INTEGER,
    week3 INTEGER,
    week4 INTEGER,
    week5 INTEGER,
    total INTEGER,
    leave_count INTEGER,
    leave_details TEXT,
    comments TEXT
)`);

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { employee_id, employee_name, acf2_id, td_mail, wipro_mail, week1, week2, week3, week4, week5, total, leave_count, leave_details, comments } = req.body;

    db.run(`INSERT INTO employee (employee_id, employee_name, acf2_id, td_mail, wipro_mail, week1, week2, week3, week4, week5, total, leave_count, leave_details, comments) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [employee_id, employee_name, acf2_id, td_mail, wipro_mail, week1, week2, week3, week4, week5, total, leave_count, leave_details, comments], 
            function(err) {
        if (err) {
            res.status(500).send("Error inserting data");
        } else {
            res.status(200).send("Data inserted successfully");
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Employer app running at http://localhost:${port}`);
});
