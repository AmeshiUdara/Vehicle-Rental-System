const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  } else {
    try {
      const decoded = jwt.verify(token, config.get('jwtSecret'));

      req.user = decoded.user;

      next();
    } catch (err) {
      res.status(401).json({ msg: 'Invalid token' });
    }
  }
};
