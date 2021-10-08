const express = require('express');
const app = express();

app.use(express.json({ extended: false }));

// God friended me

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

app.use('/api/licences', require('./routes/licence'));
app.use('/api/rental', require('./routes/rental'));
app.use('/api/users', require('./routes/user'));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
