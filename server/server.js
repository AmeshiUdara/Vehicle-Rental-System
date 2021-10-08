const express = require('express');
const app = express();
const fileupload = require('express-fileupload');
const cron = require('node-cron');
const axios = require('axios');
const ObjectsToCsv = require('objects-to-csv');

app.use(fileupload());
//init middlewares
app.use(express.json({ extended: false }));

//allowed cross-origin
app.get('/', (req, res) => res.send('API running...'));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/contacts', require('./routes/api/contacts'));
app.use('/api/vehicles', require('./routes/api/vehicles'));
app.use('/api/equipments', require('./routes/api/equipments'));
app.use('/api/prices', require('./routes/api/prices'));
app.use('/api/bookings', require('./routes/api/bookings'));
app.use('/api/carts', require('./routes/api/carts'));

//cronjob to handle file writing at every 12.01 p.m
cron.schedule('00 01 00 * * * ', async () => {
  console.log('=========================');
  const suspendedLicense = await axios.get(
    `http://localhost:5050/api/licences`
  );

  const csv = new ObjectsToCsv(suspendedLicense.data);
  let csv_dir = `./public/license.csv`;
  await csv.toDisk(csv_dir);

  console.log('Records updated...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
