const db = require('../config/db');

const Price = {
  create: (amount, created_date, status) => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO price (amount,created_date,status) VALUES (?,?,?)';

      db.query(query, [amount, created_date, status], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  getById: id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM price WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0]);
      });
    });
  },
  getList: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM price WHERE status <> 0';
      db.query(query, [null], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
  statusChange: (id, status) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE price SET status = ? WHERE id = ?';
      db.query(query, [status, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  }
};

module.exports = Price;
