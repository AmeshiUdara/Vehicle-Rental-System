const express = require('express');
const router = express.Router();
const neatCsv = require('neat-csv');
const fs = require('fs');

//@route GET api/licence
//@desc  read a CSV file and return data
//@access Public
router.get('/', async (req, res) => {
  try {
    let csv_dir = `${__dirname}/../public/license.csv`;

    fs.readFile(csv_dir, async (err, data) => {
      if (err) {
        return res.status(500).send('Server error');
      }
      let licenseList = await neatCsv(data);
      return res.send(licenseList);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
