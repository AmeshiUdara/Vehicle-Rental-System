const mysql = require('mysql');
const config = require('config');

const db_config = config.get('mysql_config');

const dbConnection = mysql.createConnection(db_config);

dbConnection.connect(err => {
  if (err) {
    console.log(err.message);
  }
  console.log('Mysql Connected...');
});

module.exports = dbConnection;
