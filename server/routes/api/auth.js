const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../../middlewares/auth');
const User = require('../../models/User');

//@route GET api/auth
//@desc  Protect a route
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.getUser(req.user.id);
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route POST api/auth
//@desc  User login
//@access Public
router.post(
  '/',
  [
    check('email', 'Provide a valid email').isEmail(),
    check('password', 'password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({
          msg: 'Invalid credentials'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          msg: 'Invalid credentials'
        });
      }

      const payload = {
        user: {
          id: user.id,
          email: user.email,
          status: user.status,
          fullname: user.fullname,
          contact: user.contact,
          role: user.role,
          dob: user.dob,
          isnew: user.isnew
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      return res.status(500).send('Server error');
    }
  }
);
module.exports = router;
