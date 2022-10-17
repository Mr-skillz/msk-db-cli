const { conn } = require("../workers/db");
    const sql = `CREATE TABLE IF NOT EXISTS msk_test112(
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255),
        date VARCHAR(100) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)) ENGINE = InnoDB`;

    conn.query(sql, (err, rows, fields)=>{
        if (err) console.log(err)
        else console.log(rows);
    })
    