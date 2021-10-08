const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  } else {
    try {
      const decoded = jwt.verify(token, config.get('jwtSecret'));
      if (decoded.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Acess denied' });
      }

      req.user = decoded.user;

      next();
    } catch (err) {
      console.log(err.message);
      res.status(401).json({ msg: 'Invalid token' });
    }
  }
};
