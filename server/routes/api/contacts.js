const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const moment = require('moment');

const admin = require('../../middlewares/admin');
const Message = require('../../models/Message');

//@route POST api/contacts
//@desc  Create a new contact message
//@access Public
router.post(
  '/',
  [
    check('content', 'content is required')
      .not()
      .isEmpty(),
    check('status', 'status is required')
      .not()
      .isEmpty(),
    check('firstname', 'firstname is required')
      .not()
      .isEmpty(),
    check('lastname', 'lastname is required')
      .not()
      .isEmpty(),
    check('email', 'email is required')
      .not()
      .isEmpty(),
    check('email', 'Invalid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { content, status, firstname, lastname, email, user_id } = req.body;

      const newMessage = {
        content,
        status,
        date: moment().format('YYYY-MM-DD hh:mm:ss'),
        firstname,
        lastname,
        email,
        user_id: 1
      };

      const result = await Message.create(newMessage);
      let id = result.insertId;
      const msg = await Message.getById(id);
      if (msg) {
        return res.json(msg);
      }
      return res.status(400).send('message did not send');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route GET api/contacts
//@desc  get all messages
//@access private - admin

router.get('/', admin, async (req, res) => {
  try {
    const messages = await Message.getList();
    if (!messages) {
      return res.status(404).send('Data not found');
    }
    res.json(messages);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route PUT api/contacts/:id
//@desc  status change of a message
//@access private - admin

router.put('/', admin, async (req, res) => {
  try {
    const messages = await Message.deleteAll();
    if (!messages) {
      return res.status(404).send('Data not found');
    }
    res.json(messages);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
