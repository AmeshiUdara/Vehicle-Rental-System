const db = require('../config/db');

const Message = {
  create: message => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO message (content, date, status, firstname, lastname, email, user_id) VALUES (?,?,?,?,?,?,?)';

      db.query(
        query,
        [
          message.content,
          message.date,
          message.status,
          message.firstname,
          message.lastname,
          message.email,
          message.user_id
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  getById: id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM message WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  getList: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM message WHERE status <> 0';
      db.query(query, [null], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
  deleteAll: () => {
    return new Promise((resolve, reject) => {
      const query = 'truncate message';
      db.query(query, [null], (err, results) => {
        if (err) {
          return reject(err);
        }
        results = 'Deleted successfully';
        return resolve(results);
      });
    });
  }
};

module.exports = Message;
