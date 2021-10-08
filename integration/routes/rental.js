const express = require('express');
const cheerio = require('cheerio');
const _ = require('lodash');
const axios = require('axios');

const router = express.Router();

const URL = 'https://www.malkey.lk/rates/self-drive-rates.html';

//@route  GET api/rental
//@desc   Scrape date from a website and return
//@access Public
router.get('/', async (req, res) => {
  try {
    const response = await getData();
    return res.send(response);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//scraping and formatting the data from `https://www.malkey.lk/rates/self-drive-rates.html`
const getData = async () => {
  const response = await axios.get(URL);
  const $ = cheerio.load(response.data);
  let data = [];
  const test = $(
    'body > main > div > div > div.right-content.col-lg-10.col-md-9.col-sm-12 > div.main-content > div.rates.desktop-view-rates > div > table > tbody >'
  ).each((index, row) => {
    const vehicle = $(row).find('.percent-40').text().replace(/\s\s+/g, '');
    const price = $(row).find('.percent-40').next().next().text();
    const _data = {
      id: index,
      vehicle,
      price
    };
    if (!_.values(_data).every(_.isEmpty)) {
      data.push(_data);
    }
  });

  return data;
};

module.exports = router;
