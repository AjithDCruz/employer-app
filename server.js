const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER,        // PostgreSQL user
  host: process.env.DB_HOST,        // PostgreSQL host (e.g., your-cloud-db-host)
  database: process.env.DB_NAME,    // PostgreSQL database name
  password: process.env.DB_PASSWORD, // PostgreSQL password
  port: process.env.DB_PORT || 5432  // PostgreSQL port (default is 5432)
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Create table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS employee (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(255),
    employee_name VARCHAR(255),
    acf2_id VARCHAR(255),
    td_mail VARCHAR(255),
    wipro_mail VARCHAR(255),
    week1 INT,
    week2 INT,
    week3 INT,
    week4 INT,
    week5 INT,
    total INT,
    leave_count INT,
    leave_details TEXT,
    comments TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err);
  }
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { employee_id, employee_name, acf2_id, td_mail, wipro_mail, week1, week2, week3, week4, week5, total, leave_count, leave_details, comments } = req.body;
  pool.query(
    `INSERT INTO employee (employee_id, employee_name, acf2_id, td_mail, wipro_mail, week1, week2, week3, week4, week5, total, leave_count, leave_details, comments) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [employee_id, employee_name, acf2_id, td_mail, wipro_mail, week1, week2, week3, week4, week5, total, leave_count, leave_details, comments],
    (err) => {
      if (err) {
        res.status(500).send('Error inserting data');
      } else {
        res.status(200).send('Data inserted successfully');
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Employer app running on http://localhost:${port}`);
});
