#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");
const { exec } = require("child_process");
const program = require("commander");
const figlet = require("figlet");
const chalk = require("chalk");
const chalkTable = require("chalk-table");
const {
  createDB,
  removeDB,
  showAllDB,
  numberOfTables,
} = require("./workers/database-worker");
const draw = (text = "Welcome to msk-cli") => {
  figlet(text, function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
  });
};

const closeTerminal = (delay = 1000) => {
  setTimeout(() => {
    process.exit(1);
  }, delay);
};

const options = {
  leftPad: 2,
  columns: [
    { field: "Database", name: chalk.cyan("Database") },
    { field: "Size", name: chalk.magenta("Size(MB)") },
  ],
};

const tasker = (cmd = "ls -a") => {
  return exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

program
  .command("create-db <database-name>")
  .description("create a new database")
  .action(async (db) => {
    try {
      let result = await createDB(db);
      if (result) {
        draw("database created");
        closeTerminal();
      } else {
        draw("Database already exists!");
        closeTerminal();
      }
    } catch ({ message }) {
      console.log(message);
      closeTerminal();
    }
  });

program
  .command("remove-db <database-name>")
  .description("delete a database")
  .action(async (db) => {
    try {
      let result = await removeDB(db);
      if (result) {
        draw("database deleted");
        closeTerminal();
      } else {
        draw("Database does not exists!");
        closeTerminal();
      }
    } catch ({ message }) {
      console.log(message);
    }
  });

program
  .command("show-db")
  .description("show all databases")
  .action(async (db) => {
    try {
      let result = await showAllDB();
      let tbs = [];
      result.forEach(async (tb) => {
        tbs.push({ ...tb });
      });
      const table2 = chalkTable(options, tbs);
      console.log(table2);
      closeTerminal(0);
    } catch ({ message }) {
      console.log(message);
    }
  });

program
  .command("connect-db <host user name pass>")
  .description("Connect to database")
  .action(async (host, user, name, pass) => {
    const options = {
      leftPad: 2,
      columns: [
        { field: "host", name: chalk.cyan("Host") },
        { field: "user", name: chalk.magenta("User") },
        { field: "name", name: chalk.green("Name") },
        { field: "pass", name: chalk.red("Password") },
      ],
    };
    process.env.DATABASE_HOST = host;
    process.env.DATABASE_USER = user;
    process.env.DATABASE_PASS = pass;
    process.env.DATABASE_NAME = name;
    tbs = [
      {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        pass: process.env.DATABASE_PASS,
        name: process.env.DATABASE_NAME,
      },
    ];
    console.log(host, user, name, pass);
    try {
      const table2 = chalkTable(options, tbs);
      console.log(table2);
      closeTerminal(0);
    } catch ({ message }) {
      process.env.DATABASE_PASS = "";
      console.log(message);
    }
  });

program
  .command("migration <flag filename>")
  .description("Create a database migration")
  .action((flag, filename) => {
    let temp = `const { conn } = require("../workers/db");
    const sql = \`CREATE TABLE IF NOT EXISTS msk_${filename}(
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255),
        date VARCHAR(100) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)) ENGINE = InnoDB\`;

    conn.query(sql, (err, rows, fields)=>{
        if (err) console.log(err)
        else console.log(rows);
    })
    `;
    try {
      if (flag == "c") {
        fs.writeFileSync(`migrations/${filename}.js`, temp, "utf-8");
        draw("Migration file created");
      } else {
        fs.unlinkSync(`migrations/${filename}.js`);
        draw("Migration file deleted");
      }

      console.log(flag);
      closeTerminal();
    } catch ({ message }) {
      console.log(message);
      closeTerminal();
    }
  });

program
  .command("migrate <run filename>")
  .description("Run migration")
  .action((run, filename) => {
    try {
      tasker(`node ./migrations/${filename}.js`);
      draw("migration completed");
      console.log(filename);
      closeTerminal();
    } catch ({ message }) {
      console.log(message);
      closeTerminal();
    }
  });

program
  .command("dc <folder>")
  .description("Create Directory")
  .action((folder) => {
    try {
      let result = fs.mkdirSync(folder);
      draw("Folder created");
      closeTerminal();
    } catch ({ message }) {
      console.log(message);
      closeTerminal();
    }
  });

program
  .command("dd <folder>")
  .description("Remove Directory")
  .action((folder) => {
    try {
      let result = fs.rmdirSync(folder);
      draw("Folder Deleted");
      closeTerminal();
    } catch ({ message }) {
      console.log(message);
      closeTerminal();
    }
  });

program.parse(process.argv);
