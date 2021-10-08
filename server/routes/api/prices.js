const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const moment = require('moment');
const axios = require('axios');
const admin = require('../../middlewares/admin');
const Price = require('../../models/Price');

//@route POST api/prices
//@desc  Create a new prices
//@access Private - admin only
router.post(
  '/',
  admin,
  [check('amount', 'amount is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { amount } = req.body;
      let created_date = moment().format('YYYY-MM-DD hh:mm:ss');

      const result = await Price.create(amount, created_date, 1);
      let id = result.insertId;
      const msg = await Price.getById(id);
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

//@route GET api/prices
//@desc  get all prices
//@access Private - admin only
router.get('/', admin, async (req, res) => {
  try {
    const priceList = await Price.getList();
    if (!priceList) {
      return res.status(404).send('Data not found');
    }
    res.json(priceList);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route PUT api/prices/:id
//@desc  status change of a price
//@access Private - admin only
router.put(
  '/:id',
  admin,
  [check('status', 'status is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { status } = req.body;
      const price = await Price.getById(id);
      if (!price) {
        return res.status(404).send('Data not found');
      }

      const update = await Price.statusChange(id, status);
      if (!update) {
        return res.status(401).send('Data not found');
      }

      res.json(update);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route GET api/prices/web/online
//@desc  get all prices
//@access Private - admin only
router.get('/web/online', admin, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5050/api/rental');

    if (!response.data) {
      return res.status(404).send('Data not found');
    }
    res.send(response.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
