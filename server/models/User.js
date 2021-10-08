const db = require('../config/db');

const User = {
  create: (user) => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO user (fullname, dob, email, password, contact, licence, bill, status, role, isnew, license_number) VALUES (?,?,?,?,?,?,?,?,?,?,?)';

      db.query(
        query,
        [
          user.fullname,
          user.dob,
          user.email,
          user.password,
          user.contact,
          user.licence,
          user.bill,
          user.status,
          user.role,
          user.isnew,
          user.licensenumber
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
  getUser: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT *   FROM user WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }

        // if we return just results it will still gv us the relevent user bt in `[ {} ]`
        return resolve(results[0]);
      });
    });
  },
  getUserLicenseNumber: (id) => {
    return new Promise((resolve, reject) => {
      const query =
        'SELECT license_number as licensenumber FROM user WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }

        // if we return just results it will still gv us the relevent user bt in `[ {} ]`
        return resolve(results[0]);
      });
    });
  },
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT *  FROM user WHERE email = ?';
      db.query(query, [email], (err, results) => {
        if (err) {
          return reject(err);
        }

        // if we return just results it will still gv us the relevent user bt in `[ {} ]`
        return resolve(results[0]);
      });
    });
  },
  list: () => {
    return new Promise((resolve, reject) => {
      const query =
        'SELECT *, "" as password FROM user WHERE (status <> 0 ) AND (status <> 4)';
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
      const query = 'UPDATE user SET status = ? WHERE id = ?';
      db.query(query, [status, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  statusChangeAdmin: (id, status, isnew) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE user SET status = ?, isnew = ? WHERE id = ?';
      db.query(query, [status, isnew, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  update: (id, updatedData) => {
    return new Promise((resolve, reject) => {
      const query =
        'UPDATE user SET fullname = ? , password= ?, contact= ? WHERE id = ?';
      db.query(
        query,
        [
          updatedData.fullname,
          updatedData.new_password,
          updatedData.contact,
          id
        ],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  }
};

module.exports = User;
