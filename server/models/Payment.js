const db = require('../config/db');
const Payment = {
  create: payment => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO payment (status, amount, booking_id, created_date) VALUES (?,?,?,?)';

      db.query(
        query,
        [
          payment.status,
          payment.total,
          payment.booking_id,
          payment.created_date
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
      const query = 'SELECT * FROM payment WHERE booking_id = ?';

      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0]);
      });
    });
  }
};
module.exports = Payment;
