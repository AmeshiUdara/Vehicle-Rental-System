const express = require('express');
const router = express.Router();

const User = require('../models/User');
//@route GET api/users
//@desc  return list if users
//@access Public route
router.get('/', async (req, res) => {
  try {
    const users = await User.list();
    res.json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
