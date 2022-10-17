const { conn } = require("./db");

exports.createDB = (db) => {
  return new Promise((resolve, reject) => {
    conn.query(`CREATE DATABASE IF NOT EXISTS ${db}`, (err, rows, fields) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

exports.removeDB = (db) => {
  return new Promise((resolve, reject) => {
    conn.query(`DROP DATABASE IF EXISTS ${db}`, (err, rows, fields) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

exports.showAllDB = () => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT table_schema "Database", ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) "Size" FROM information_schema.tables GROUP BY table_schema;`,
      (err, rows, fields) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

exports.numberOfTables = () => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT IFNULL(table_schema,'Total') "Database",TableCount 
      FROM (SELECT COUNT(1) TableCount,table_schema 
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('information_schema','mysql') 
            GROUP BY table_schema WITH ROLLUP) A;`,
      (err, rows, fields) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};
