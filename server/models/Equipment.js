const db = require('../config/db');

const Equipment = {
  create: equipment => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO equipment (name, rating, qty, status, image, price_id) VALUES (?,?,?,?,?,?)';

      db.query(
        query,
        [
          equipment.name,
          equipment.rating,
          equipment.qty,
          equipment.status,
          equipment.image,
          equipment.price_id
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
  getEquipmentNameById: id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT name  FROM equipment WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }

        // if we return just results it will still gv us the relevent user bt in `[ {} ]`
        return resolve(results[0]);
      });
    });
  },
  getEquipmentById: id => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT *  FROM equipment WHERE id = ?';
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
      const query = 'SELECT * FROM equipment WHERE status <> 0';
      db.query(query, null, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  getClientList: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM equipment where status <> 2';
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
      const query = 'UPDATE equipment SET status = ? WHERE id = ?';
      db.query(query, [status, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  addBooking: (equipment_id, qty) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE equipment SET  qty = ? WHERE id = ?';
      db.query(query, [qty, equipment_id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  getEquipmentIds: id => {
    return new Promise((resolve, reject) => {
      const query =
        'SELECT equipment_id as id, amount FROM equipment_booking WHERE booking_id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.parse(JSON.stringify(results)));
      });
    });
  },
  returnEquipment: (id, status, qty) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE equipment SET status = ?, qty = ? WHERE id = ?';
      db.query(query, [status, qty, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  deleteEqupment: booking_id => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM equipment_booking  WHERE booking_id = ?';
      db.query(query, [booking_id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  updateAdminEquipment: (id, qty, price_id) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE equipment SET qty =? , price_id = ? WHERE id = ?';
      db.query(query, [qty, price_id, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  }
};

module.exports = Equipment;
