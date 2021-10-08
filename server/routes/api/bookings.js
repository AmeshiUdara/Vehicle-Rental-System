const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const _ = require('lodash');
const moment = require('moment');
const axios = require('axios');
const nodemailer = require('nodemailer');
const config = require('config');
const path = require('path');
const neatCsv = require('neat-csv');
const fs = require('fs');

const admin = require('../../middlewares/admin');
const auth = require('../../middlewares/auth');
const Booking = require('../../models/Booking');
const Vehicle = require('../../models/Vehicle');
const Equipment = require('../../models/Equipment');
const Payment = require('../../models/Payment');
const User = require('../../models/User');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.get('email'),
    pass: config.get('password')
  }
});

//@route POST api/bookings
//@desc  Create a new booking
//@access Private
router.post(
  '/',
  auth,
  [
    check('user_id', 'user_id is required').not().isEmpty(),
    check('booking_date', 'booking_date is required').not().isEmpty(),
    check('return_date', 'return_date is required').not().isEmpty(),
    check('status', 'status is required').not().isEmpty(),
    check('vehicles', 'vehicles are required').not().isEmpty(),
    check('pickup_location', 'pickup_location is required').not().isEmpty(),
    check('total', 'total is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        user_id,
        booking_date,
        return_date,
        status,
        pickup_location,
        drop_location,
        vehicles,
        equipments,
        total
      } = req.body;

      // const licensenumber = await User.getUserLicenseNumber(user_id);

      const checkUserLicense = await User.getUser(user_id);
      const licensenumber = checkUserLicense.license_number;
      // const suspendedLicense = await axios.get(
      //   `http://localhost:5050/api/licences`
      // );
      let csv_dir = `${__dirname}/../../public/license.csv`;

      fs.readFile(csv_dir, async (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        licencelist = await neatCsv(data);
        let isValid = _.some(licencelist, { licensenumber });

        if (isValid) {
          let mailOptions = {
            from: 'dark123.splash@gmail.com',
            to: 'gimnath.splash@gmail.com',
            subject: 'Suspended License Recieved',
            text: `Suspended license number ${licensenumber} is recieved, License image is attached to the email.`,
            attachments: [
              {
                filename: checkUserLicense.licence,
                path: path.resolve(
                  `${__dirname}/../../public/images/users/${checkUserLicense.licence}`
                )
              }
            ]
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Message sent!');
            }
          });

          return res
            .status(500)
            .json({ error: 'There is an issue in your license' });
        }

        let booking = {
          user_id,
          booking_date: moment(booking_date).format('YYYY-MM-DD HH:mm'),
          return_date: moment(return_date).format('YYYY-MM-DD HH:mm'),
          status,
          pickup_location,
          drop_location,
          created_date: moment().format('YYYY-MM-DD HH:mm')
        };

        const result = await Booking.create(booking);
        let booking_id = result.insertId;

        if (result) {
          let errors = '';
          let status = 2;
          let payment = {
            status: 1,
            total,
            booking_id,
            created_date: moment().format('YYYY-MM-DD HH:mm')
          };
          const booking_toatal = await Payment.create(payment);
          if (!booking_toatal) {
            return res.status(500).send('Server error');
          }

          if (equipments) {
            for (const equipment of equipments) {
              const _equipment = await Equipment.getEquipmentById(equipment.id);

              if (_equipment.qty < equipment.amount) {
                //amount coming from client side
                return res.status(400).send('Equipment qty exceeded');
              } else {
                let qty = _equipment.qty - equipment.amount;

                const result = await Equipment.addBooking(equipment.id, qty);
                if (!result) {
                  errors = 'Server error';
                }
                // console.log('result', result);

                const createBooking = await Booking.createConnection(
                  equipment.id,
                  booking_id,
                  equipment.amount
                );

                if (!createBooking) {
                  errors = 'Server error';
                }
              }
            }
          }
          for (const vehicle of vehicles) {
            const result = await Vehicle.addBooking(vehicle, status);
            if (!result) {
              return res.status(400).send('Here');
            }

            const createBooking = await Booking.createConnectionVehicle(
              vehicle,
              booking_id
            );

            if (!createBooking) {
              errors = 'Server error';
            }
          }

          const userUpdate = await User.statusChange(user_id, status);
          if (userUpdate) {
            return res.json(result);
          }
        }

        return res.status(400).send('Booking could not be made');
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route GET api/bookings/:id
//@desc  Get a specific bookings of a specific user
//@access Private

router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    let _bookingList = [];
    const bookingList = await Booking.getListByUserId(id);
    if (bookingList) {
      for (const booking of bookingList) {
        let bookedEquipments = [];
        let bookedVehicles = [];

        const vehicleIds = await Vehicle.getVehiclesIds(booking.id);

        for (const vehicle_id of vehicleIds) {
          let vehicleName = await Vehicle.getVehicleNamesById(vehicle_id.id);
          bookedVehicles.push(vehicleName);
        }

        const equipmentIds = await Equipment.getEquipmentIds(booking.id);

        for (const equipment_id of equipmentIds) {
          let equipmentName = await Equipment.getEquipmentNameById(
            equipment_id.id
          );
          bookedEquipments.push(equipmentName);
        }

        let bookingObj = {
          id: booking.id,
          booking_date: booking.booking_date,
          return_date: booking.return_date,
          status: booking.status,
          vehicles: bookedVehicles,
          equipments: bookedEquipments
        };

        _bookingList.push(bookingObj);
      }
      res.json(_bookingList);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route GET api/bookings/critical/:id
//@desc  Get critical vehicle booking of a specific user
//@access Private
router.get('/critical/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const notReturnedBooking = await Booking.getCriticalBookings(id);

    if (notReturnedBooking) {
      let return_date = moment(notReturnedBooking.return_date).format(
        'YYYY-MM-DD HH:mm'
      );

      //checking weather the return time is expired now
      if (return_date < moment(Date.now()).format('YYYY-MM-DD HH:mm')) {
        let bookedEquipments = [];
        let bookedVehicles = [];

        const vehicleIds = await Vehicle.getVehiclesIds(notReturnedBooking.id);
        for (const vehicle_id of vehicleIds) {
          let vehicleName = await Vehicle.getVehicleNamesById(vehicle_id.id);
          bookedVehicles.push(vehicleName);
        }

        const equipmentIds = await Equipment.getEquipmentIds(
          notReturnedBooking.id
        );
        for (const equipment_id of equipmentIds) {
          let equipmentName = await Equipment.getEquipmentNameById(
            equipment_id.id
          );
          bookedEquipments.push(equipmentName);
        }

        let criticalBooking = {
          id: notReturnedBooking.id,
          booking_date: moment(notReturnedBooking.booking_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          return_date: moment(notReturnedBooking.return_date).format(
            'YYYY-MM-DD HH:mm'
          ),
          status: notReturnedBooking.status,
          vehicles: bookedVehicles,
          equipments: bookedEquipments
        };

        res.json(criticalBooking);
      } else {
        res.json({ msg: 'Return time is not exceeded' });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//======================================================================================
//@route GET api/bookings/check/blacklist/:id
//@desc  make blacklisted if the user hasn't collected the vehicle on the booking time
//@access Private
router.get('/check/blacklist/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.getNoteCollectedBookings(id);

    if (booking) {
      let booking_time = moment(booking.booking_date).format(
        'YYYY-MM-DD HH:mm'
      );

      //checking weather the return time is expired now
      if (booking_time < moment(Date.now()).format('YYYY-MM-DD HH:mm')) {
        let bookedEquipments = [];
        let bookedVehicles = [];

        const vehicleIds = await Vehicle.getVehiclesIds(booking.id);
        for (const vehicle_id of vehicleIds) {
          let vehicleName = await Vehicle.getVehicleNamesById(vehicle_id.id);
          bookedVehicles.push(vehicleName);
        }

        const equipmentIds = await Equipment.getEquipmentIds(booking.id);
        for (const equipment_id of equipmentIds) {
          let equipmentName = await Equipment.getEquipmentNameById(
            equipment_id.id
          );
          bookedEquipments.push(equipmentName);
        }

        const setUserStatus = User.statusChange(id, 3);
        if (!setUserStatus) {
          return res.status(500).send('Server error');
        }

        let notCollected = {
          id: booking.id,
          booking_date: moment(booking.booking_date).format('YYYY-MM-DD HH:mm'),
          return_date: moment(booking.return_date).format('YYYY-MM-DD HH:mm'),
          status: booking.status,
          vehicles: bookedVehicles,
          equipments: bookedEquipments
        };

        res.json(notCollected);
      } else {
        res.json({ msg: 'Booking time is not exceeded' });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//======================================================================================

//=====================================================
//@route PUT api/bookings/critical/:id
//@desc  return a late return vehicle and equipments
//@access Private
router.put('/critical/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const late_booking = await Booking.getBookingById(id);
    if (!late_booking) {
      res.status(404).send('Data not found');
    }
    let user_id = late_booking.user_id;

    const setUserStatus = await User.statusChange(user_id, 1);
    if (setUserStatus) {
      const vehicleIds = await Vehicle.getVehiclesIds(id);

      for (const vehicle of vehicleIds) {
        const setVehicleStatus = await Vehicle.statusChange(vehicle.id, 1);
        if (!setVehicleStatus) {
          return res.status(500).send('Server error');
        }
      }

      const equipmentIds = await Equipment.getEquipmentIds(id);
      for (const _equ of equipmentIds) {
        const equipment = await Equipment.getEquipmentById(_equ.id);
        let _qty = _equ.amount + equipment.qty;

        const setEquipmentStatus = await Equipment.returnEquipment(
          _equ.id,
          1,
          _qty
        );
        if (!setEquipmentStatus) {
          return res.status(500).send('Server error');
        }
      }

      const returnBooking = await Booking.statusChange(id, 3);
      res.json(returnBooking);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
//=====================================================================

//@route PUT api/bookings/equipments/:booking_id
//@desc  update equipment of a not collected booking
//@access Private
router.put(
  '/equipments/:booking_id',
  auth,
  [check('equipments', 'equipments is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { booking_id } = req.params;
      const { equipments } = req.body;

      const check = await Booking.getBookingById(booking_id);
      if (!check) {
        return res.status(404).send('Data not found');
      }

      const equipmentIds = await Equipment.getEquipmentIds(booking_id);
      for (const equ of equipmentIds) {
        const db_equipment = await Equipment.getEquipmentById(equ.id);
        let _qty = db_equipment.qty + equ.amount;
        const setEquipmentStatus = await Equipment.returnEquipment(
          equ.id,
          1,
          _qty
        );
        if (!setEquipmentStatus) {
          return res.status(500).send('Server error');
        }
      }
      const deleteEqumpent = await Equipment.deleteEqupment(booking_id);
      if (!deleteEqumpent) {
        return res.status(500).send('Server error');
      }

      for (const _equ of equipments) {
        const _equipment = await Equipment.getEquipmentById(_equ.id);

        if (_equipment.qty < _equ.amount) {
          //amount coming from client side
          return res.status(400).send('Equipment qty exceeded');
        } else {
          let qty = _equipment.qty - _equ.amount;

          const result = await Equipment.addBooking(_equ.id, qty);
          if (!result) {
            errors = 'Server error';
          }
          const updateBooking = await Booking.createConnection(
            _equ.id,
            booking_id,
            _equ.amount
          );
          if (!updateBooking) {
            errors = 'Server error';
          }
        }
      }
      res.json({ msg: 'Equipment Updated' });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route GET api/bookings/booking/:booking_id
//@desc  get a specific booking
//@access Private
router.get('/booking/:booking_id', auth, async (req, res) => {
  try {
    const { booking_id } = req.params;
    const booking = await Booking.getBookingById(booking_id);
    if (!booking) {
      return res.status(404).send('Data not found');
    }

    const equipmentIds = await Equipment.getEquipmentIds(booking_id);
    let equipments = [];
    if (equipmentIds) {
      for (const equipment of equipmentIds) {
        const _equipment = await Equipment.getEquipmentNameById(equipment.id);
        let name = _equipment.name;
        let _equ = {
          name,
          amount: equipment.amount
        };

        equipments.push(_equ);
      }
    } else {
      return res.status(404).send('Data not found');
    }

    const bookedVehicles = await Vehicle.getVehiclesByBookingId(booking_id);
    if (!bookedVehicles) {
      return res.status(404).send('Data not found');
    }
    let _booking = {
      id: booking.id,
      booking_date: moment(booking.booking_date).format('YYYY-MM-DD HH:mm'),
      return_date: moment(booking.return_date).format('YYYY-MM-DD HH:mm'),
      status: booking.status,
      vehicles: bookedVehicles,
      equipments: equipments
    };

    return res.json(_booking);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route PUT api/bookings/extend/:id
//@desc  extend booking return date
//@access Private
router.put(
  '/extends/:booking_id',
  auth,
  [check('extend_time', 'extend_time is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { extend_time } = req.body;
      const { booking_id } = req.params;

      const check = await Booking.getBookingById(booking_id);
      if (!check) {
        return res.status(404).send('Data not found');
      }

      let db_return = moment(check.return_date).format('YYYY-MM-DD');
      let _extend = db_return.concat(' ', extend_time);
      if (!_extend) {
        return res.status(404).send('Data not found');
      }
      const update = await Booking.extendReturnDate(booking_id, _extend);

      res.json(update);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route GET api/bookings/
//@desc  get all bookings
//@access Private-admin
router.get('/', admin, async (req, res) => {
  try {
    const bookings = await Booking.getList();
    let booking_list = [];
    if (!bookings) {
      return res.status(400).json({ msg: 'No bookings found' });
    }
    for (const booking of bookings) {
      const price = await Payment.getById(booking.id);
      if (price) {
        booking_list.push(_.assign(booking, { price: price.amount }));
      }
    }
    res.json(booking_list);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route GET api/bookings/
//@desc  admin earnings according to the week
//@access Private-admin
router.get('/all/earnigns', admin, async (req, res) => {
  try {
    const bookings = await Booking.getList();
    let booking_list = [];
    let mon = [];
    let tue = [];
    let wed = [];
    let thr = [];
    let fri = [];
    let sat = [];
    let sun = [];

    if (!bookings) {
      return res.status(400).json({ msg: 'No bookings found' });
    }
    for (const booking of bookings) {
      const price = await Payment.getById(booking.id);
      if (price) {
        booking_list.push(_.assign(booking, { price: price.amount }));
      }
    }
    for (const _bk of booking_list) {
      if (moment(_bk.created_date).format('dddd') === 'Saturday') {
        sat.push(_bk);
      } else if (moment(_bk.created_date).format('dddd') === 'Sunday') {
        sun.push(_bk);
      } else if (moment(_bk.created_date).format('dddd') === 'Monday') {
        mon.push(_bk);
      } else if (moment(_bk.created_date).format('dddd') === 'Tuesday') {
        tue.push(_bk);
      } else if (moment(_bk.created_date).format('dddd') === 'Wednesday') {
        wed.push(_bk);
      } else if (moment(_bk.created_date).format('dddd') === 'Thursday') {
        thr.push(_bk);
      } else if (moment(_bk.created_date).format('dddd') === 'Friday') {
        fri.push(_bk);
      }
    }

    let sat_sum = _.sum(_.map(sat, 'price'));
    let sun_sum = _.sum(_.map(sun, 'price'));
    let mon_sum = _.sum(_.map(mon, 'price'));
    let tue_sum = _.sum(_.map(tue, 'price'));
    let wed_sum = _.sum(_.map(wed, 'price'));
    let thr_sum = _.sum(_.map(thr, 'price'));
    let fri_sum = _.sum(_.map(fri, 'price'));

    let data = {
      sun: {
        total: sun_sum
      },
      mon: {
        total: mon_sum
      },
      tue: {
        total: tue_sum
      },
      wed: {
        total: wed_sum
      },
      thr: {
        total: thr_sum
      },
      fri: {
        total: fri_sum
      },
      sat: {
        total: sat_sum
      }
    };

    res.json(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route GET api/bookings/admin/all
//@desc  Get all bookings
//@access Private-admin
router.get('/admin/all', admin, async (req, res) => {
  try {
    let _bookingList = [];
    const bookingList = await Booking.getList();
    if (bookingList) {
      for (const booking of bookingList) {
        let bookedEquipments = [];
        let bookedVehicles = [];
        const user = await User.getUser(booking.user_id);
        const price = await Payment.getById(booking.id);

        const equipmentIds = await Equipment.getEquipmentIds(booking.id);

        for (const equipment_id of equipmentIds) {
          let equipmentName = await Equipment.getEquipmentNameById(
            equipment_id.id
          );
          bookedEquipments.push(equipmentName);
        }
        const vehicleIds = await Vehicle.getVehiclesIds(booking.id);

        for (const vehicle_id of vehicleIds) {
          let vehicleName = await Vehicle.getVehicleNamesById(vehicle_id.id);

          bookedVehicles.push(vehicleName);
        }

        if (price) {
          let bookingObj = {
            id: booking.id,
            user: user.fullname,
            price: price.amount,
            booking_date: booking.booking_date,
            return_date: booking.return_date,
            created_date: booking.created_date,
            status: booking.status,
            vehicles: bookedVehicles,
            equipments: bookedEquipments
          };

          _bookingList.push(bookingObj);
        }
      }
      res.json(_bookingList);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route PUT api/bookings/admin/:id
//@desc  Change status of a booking
//@access Private-admin
router.put(
  '/admin/:id',
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

      const booking = await Booking.getBookingById(id);
      if (!booking) {
        return res.status(404).send('Data not found');
      }

      if (status == 2 || status == 3) {
        let user_id = booking.user_id;

        //checking the user is already blacklisted
        const isBlackListed = await User.getUser(user_id);
        if (isBlackListed.status === 3) {
          const setUserStatus = await User.statusChange(user_id, 3);
          if (!setUserStatus) {
            res.status(500).send('Server error');
          }
        } else {
          // need to make a new customer to an old customer
          let isnew = 0;
          const setUserStatus = await User.statusChangeAdmin(user_id, 1, isnew);
          if (!setUserStatus) {
            res.status(500).send('Server error');
          }
        }

        const vehicleIds = await Vehicle.getVehiclesIds(id);

        for (const vehicle of vehicleIds) {
          const setVehicleStatus = await Vehicle.statusChange(vehicle.id, 1);
          if (!setVehicleStatus) {
            return res.status(500).send('Server error');
          }
        }

        const equipmentIds = await Equipment.getEquipmentIds(id);
        for (const _equ of equipmentIds) {
          const equipment = await Equipment.getEquipmentById(_equ.id);
          let _qty = _equ.amount + equipment.qty;

          const setEquipmentStatus = await Equipment.returnEquipment(
            _equ.id,
            1,
            _qty
          );
          if (!setEquipmentStatus) {
            return res.status(500).send('Server error');
          }
        }
      }
      const returnBooking = await Booking.statusChange(id, status);
      if (returnBooking) {
        const _booking = await Booking.getBookingById(id);
        res.json(_booking);
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
