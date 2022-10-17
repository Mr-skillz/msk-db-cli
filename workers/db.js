const mysql = require("mysql");
const conn = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  charset: "utf8mb4",
});

conn.connect((err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log(`db ....`);
  }
});

module.exports = { conn };
