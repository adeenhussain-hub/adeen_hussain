const mysql = require("mysql");
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,    
  user: process.env.DB_USER,         
  password: "",         
  database: process.env.DB_DATABASE,  
  port: process.env.DB_PORT           
});
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database");

  // const createUsersTable = `
  //   CREATE TABLE IF NOT EXISTS users (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     username VARCHAR(100) NOT NULL,
  //     email VARCHAR(150) NOT NULL UNIQUE,
  //     password VARCHAR(255) NOT NULL,
  //     refresh_token TEXT,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  //   )
  // `;

  // db.query(createUsersTable, (err, result) => {
  //   if (err) {
  //     console.error("Error creating users table:", err);
  //     return;
  //   }
  //   console.log("Users table created or already exists");
  // });
});
module.exports = db;
