const db = require('../config/db');

const Vehicle = {
  create: vehicle => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO vehicle (name, doors, seats, minimum_age, transmission, type, date_acquired, number_plate, rating, qty, lugage, status, image, price_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

      db.query(
        query,
        [
          vehicle.name,
          vehicle.doors,
          vehicle.seats,
          vehicle.minimum_age,
          vehicle.transmission,
          vehicle.type,
          vehicle.date_acquired,
          vehicle.number_plate,
          vehicle.rating,
          vehicle.qty,
          vehicle.lugage,
          vehicle.status,
          vehicle.image,
          vehicle.price_id
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
  getVehicleById: id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT *   FROM vehicle WHERE id = ?';
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
      const query = 'SELECT * FROM vehicle WHERE status <> 0';
      db.query(query, null, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
  getClientList: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM vehicle where status = 1';
      db.query(query, null, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },

  statusChange: (id, status) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE vehicle SET status = ? WHERE id = ?';
      db.query(query, [status, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  addBooking: (vehicle_id, status) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE vehicle SET status = ? WHERE id = ?';
      db.query(query, [status, vehicle_id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  getVehiclesByBookingId: id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT name FROM vehicle WHERE booking_id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
  getVehicleNamesById: id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT name FROM vehicle WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results[0]);
      });
    });
  },
  getVehiclesIds: id => {
    return new Promise((resolve, reject) => {
      const query =
        'SELECT vehicle_id as id FROM vehicle_booking WHERE booking_id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
  getAllVehiclesByBookingId: id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM vehicle WHERE booking_id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
  updateAdminVehicle: (id, price_id, minimum_age) => {
    return new Promise((resolve, reject) => {
      const query =
        'UPDATE vehicle SET price_id =? , minimum_age = ? WHERE id = ?';
      db.query(query, [price_id, minimum_age, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  }
};

module.exports = Vehicle;
