const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const Vehicle = require('../../models/Vehicle');
const Price = require('../../models/Price');
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');

//vehicle and equipment status
// deleted -0, available -1, booked - 2, onRepair -3

//@route  POST api/vehicles
//@dec    Create a vehicle
//@access private - admin only
router.post(
  '/',
  admin,
  [
    check('name', 'name is required')
      .not()
      .isEmpty(),
    check('doors', 'doors is required')
      .not()
      .isEmpty(),
    check('seats', 'seats is required')
      .not()
      .isEmpty(),
    check('minimum_age', 'minimum_age is required')
      .not()
      .isEmpty(),
    check('transmission', 'transmission is required')
      .not()
      .isEmpty(),
    check('type', 'type is required')
      .not()
      .isEmpty(),
    check('date_acquired', 'date_acquired is required')
      .not()
      .isEmpty(),
    check('number_plate', 'number_plate is required')
      .not()
      .isEmpty(),
    check('rating', 'rating is required')
      .not()
      .isEmpty(),
    check('qty', 'qty is required')
      .not()
      .isEmpty(),
    check('lugage', 'lugage is required')
      .not()
      .isEmpty(),
    check('status', 'status is required')
      .not()
      .isEmpty(),
    check('price_id', 'price_id is required')
      .not()
      .isEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      doors,
      seats,
      minimum_age,
      transmission,
      type,
      date_acquired,
      number_plate,
      rating,
      qty,
      lugage,
      status,
      price_id
    } = req.body;

    let vehicleimage_name = req.files.vehicle.name;
    let vehicleimage_file = req.files.vehicle;
    let img_dir = `${__dirname}/../../public/images/vehicles/`;

    if (!fs.existsSync(img_dir)) {
      fs.mkdirSync(img_dir);
    }

    if (!req.files) {
      return res.status(500).json({ error: 'Photo upload failed' });
    } else {
      let tmpimageName = vehicleimage_name.split('.');
      let imageName = Date.now() + '.' + tmpimageName[1];
      vehicleimage_file.mv(img_dir + imageName, err => {
        if (err) {
          return res.status(500).send('Server error');
        }
      });
      const newVehicle = {
        name,
        doors,
        seats,
        minimum_age,
        transmission,
        type,
        date_acquired,
        number_plate,
        rating,
        qty,
        lugage,
        status,
        image: imageName,
        price_id
      };
      try {
        const result = await Vehicle.create(newVehicle);
        let id = result.insertId;
        const vehicle = await Vehicle.getVehicleById(id);
        if (vehicle) {
          return res.json(vehicle);
        }
        return res.status(400).send('Vehicle could not be added');
      } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
      }
    }
  }
);

//@route  GET api/vehicles
//@dec    Get list of vehicles-client side which exclude unavailable vehicles
//@access public
router.get('/', async (req, res, next) => {
  try {
    const vehicleList = await Vehicle.getClientList();
    let list = [];
    if (vehicleList) {
      for (const vehicle of vehicleList) {
        const _amount = await Price.getById(vehicle.price_id);
        let _price = _amount.amount;

        let editedVehicle = {
          id: vehicle.id,
          name: vehicle.name,
          doors: vehicle.doors,
          seats: vehicle.seats,
          minimum_age: vehicle.minimum_age,
          transmission: vehicle.transmission,
          type: vehicle.type,
          date_acquired: moment(vehicle.date_acquired).format(
            'YYYY-MM-DD hh:mm:ss'
          ),
          number_plate: vehicle.number_plate,
          rating: vehicle.rating,
          qty: vehicle.qty,
          lugage: vehicle.lugage,
          status: vehicle.status,
          image: vehicle.image,
          price: _price,
          booking_id: vehicle.booking_id
        };

        list.push(editedVehicle);
      }

      return res.json(list);
    }
    return res.status(404).send('No data found');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  PUT api/vehicles/:id
//@dec    change status of a vehicle (which is used to delete/booked/rapiring/returned/active a vehicle)
//@access private - admin only
router.put(
  '/:id',
  admin,

  [
    check('status', 'status is required')
      .not()
      .isEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { status } = req.body;
      let isAvailable = await Vehicle.getVehicleById(id);
      if (isAvailable) {
        let sucess = await Vehicle.statusChange(id, status);
        if (sucess) {
          let editedVehicle = await Vehicle.getVehicleById(id);
          return res.json(editedVehicle);
        }
        return res.status(400).send('Status can not be changed');
      }
      return res.status(404).json({ msg: 'vehicle not found' });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server error');
    }
  }
);

//@route  GET api/vehicles/:id
//@dec    get a vehicle
//@access public

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const vehicle = await Vehicle.getVehicleById(id);
    if (vehicle) {
      const _amount = await Price.getById(vehicle.price_id);
      let _price = _amount.amount;

      let editedVehicle = {
        id: vehicle.id,
        name: vehicle.name,
        doors: vehicle.doors,
        seats: vehicle.seats,
        minimum_age: vehicle.minimum_age,
        transmission: vehicle.transmission,
        type: vehicle.type,
        date_acquired: moment(vehicle.date_acquired).format(
          'YYYY-MM-DD hh:mm:ss'
        ),
        number_plate: vehicle.number_plate,
        rating: vehicle.rating,
        qty: vehicle.qty,
        lugage: vehicle.lugage,
        status: vehicle.status,
        image: vehicle.image,
        price: _price,
        booking_id: vehicle.booking_id
      };
      return res.json(editedVehicle);
    }
    return res.status(404).send('No data found');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  GET api/admin/vehicles
//@dec    Get list of vehicles-admin
//@access private-admin only
router.get('/all/admin', admin, async (req, res) => {
  try {
    const vehicleList = await Vehicle.getList();
    let list = [];
    if (vehicleList) {
      for (const vehicle of vehicleList) {
        const _amount = await Price.getById(vehicle.price_id);
        let _price = _amount.amount;

        let editedVehicle = {
          id: vehicle.id,
          name: vehicle.name,
          doors: vehicle.doors,
          seats: vehicle.seats,
          minimum_age: vehicle.minimum_age,
          transmission: vehicle.transmission,
          type: vehicle.type,
          date_acquired: moment(vehicle.date_acquired).format(
            'YYYY-MM-DD hh:mm:ss'
          ),
          number_plate: vehicle.number_plate,
          rating: vehicle.rating,
          qty: vehicle.qty,
          lugage: vehicle.lugage,
          status: vehicle.status,
          image: vehicle.image,
          price: _price,
          booking_id: vehicle.booking_id
        };

        list.push(editedVehicle);
      }

      return res.json(list);
    }
    return res.status(404).send('No data found');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  GET api/vehicles/img/:id
//@dec    get a vehicle image
//@access public
router.get('/img/:imgName', async (req, res, next) => {
  const { imgName } = req.params;
  let file_path = path.resolve(
    `${__dirname}/../../public/images/vehicles/${imgName}`
  );
  try {
    if (!fs.existsSync(file_path)) {
      return res.status(404).send('File not found');
    }
    res.sendFile(file_path);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  PATCH api/vehicles/:id
//@dec    update vehicle
//@access private - admin only
router.patch(
  '/:id',
  admin,
  [
    check('price_id', 'price_id is required')
      .not()
      .isEmpty(),
    check('minimum_age', 'minimum_age is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const isAvailable = await Vehicle.getVehicleById(id);

      if (!isAvailable) {
        return res.status(404).send('Vehicle not found');
      }
      const { price_id, minimum_age } = req.body;
      const updated = await Vehicle.updateAdminVehicle(
        id,
        price_id,
        minimum_age
      );
      if (!updated) {
        return res.status(401).send('Vehicle not updated');
      }

      res.json(updated);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);
module.exports = router;
