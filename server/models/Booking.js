const db = require('../config/db');

const Booking = {
  create: booking => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO booking (booking_date, return_date, status, user_id, pickup_location, drop_location, created_date) VALUES (?,?,?,?,?,?,?)';

      db.query(
        query,
        [
          booking.booking_date,
          booking.return_date,
          booking.status,
          booking.user_id,
          booking.pickup_location,
          booking.drop_location,
          booking.created_date
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
  getBookingById: id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT *   FROM booking WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }

        // if we return just results it will still gv us the relevent user bt in `[ {} ]`
        return resolve(results[0]);
      });
    });
  },
  getList: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM booking WHERE status <> 0';
      db.query(query, null, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
  statusChange: (id, status) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE booking SET status = ? WHERE id = ?';
      db.query(query, [status, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  getListByUserId: id => {
    return new Promise((resolve, reject) => {
      const query =
        'SELECT * FROM booking WHERE user_id = ? order by created_date desc';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
  createConnection: (equipment_id, booking_id, amount) => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO equipment_booking(equipment_id, booking_id, amount) VALUES (?, ?, ?)';
      db.query(query, [equipment_id, booking_id, amount], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  createConnectionVehicle: (vehicle_id, booking_id) => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO vehicle_booking(vehicle_id, booking_id) VALUES (?, ?)';
      db.query(query, [vehicle_id, booking_id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  getCriticalBookings: user_id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM booking WHERE status = 4 AND user_id = ?';
      db.query(query, [user_id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0]);
      });
    });
  },
  getNoteCollectedBookings: user_id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM booking WHERE status = 1 AND user_id = ?';
      db.query(query, [user_id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0]);
      });
    });
  },
  extendReturnDate: (id, return_date) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE booking SET return_date = ? WHERE id = ?';
      db.query(query, [return_date, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  }
};
module.exports = Booking;
