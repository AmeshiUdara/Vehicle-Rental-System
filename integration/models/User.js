const db = require('../config/db');

const User = {
  list: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM user';
      db.query(query, null, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  }
};
module.exports = User;
