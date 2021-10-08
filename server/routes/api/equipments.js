const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const Price = require('../../models/Price');
const Equipment = require('../../models/Equipment');
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');

//vehicle and equipment status
// deleted -0, available -1, booked - 2, onRepair -3

//@route  POST api/equipments
//@dec    Create a equipment
//@access private - admin only
router.post(
  '/',
  admin,
  [
    check('name', 'name is required')
      .not()
      .isEmpty(),
    check('rating', 'rating is required')
      .not()
      .isEmpty(),
    check('qty', 'qty is required')
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

    const { name, rating, qty, status, price_id } = req.body;

    let equipmentimage_name = req.files.equipment.name;
    let equipment_file = req.files.equipment;
    let img_dir = `${__dirname}/../../public/images/equipments/`;

    if (!fs.existsSync(img_dir)) {
      fs.mkdirSync(img_dir);
    }

    if (!req.files) {
      return res.status(500).json({ error: 'Photo upload failed' });
    } else {
      let tmpimageName = equipmentimage_name.split('.');
      let imageName = Date.now() + '.' + tmpimageName[1];
      equipment_file.mv(img_dir + imageName, err => {
        if (err) {
          return res.status(500).send('Server error');
        }
      });
      const newEquipment = {
        name,
        rating,
        qty,
        status,
        price_id,
        image: imageName
      };
      try {
        const result = await Equipment.create(newEquipment);
        let id = result.insertId;
        const equipment = await Equipment.getEquipmentById(id);
        if (equipment) {
          return res.json(equipment);
        }
        return res.status(400).send('Equipment could not be added');
      } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
      }
    }
  }
);

//@route  GET api/equipments
//@dec    Get list of equipments
//@access public
router.get('/', async (req, res, next) => {
  try {
    const equipmentList = await Equipment.getList();
    let list = [];
    if (equipmentList) {
      for (const equipment of equipmentList) {
        const _amount = await Price.getById(equipment.price_id);
        let _price = _amount.amount;

        let _equipment = {
          id: equipment.id,
          name: equipment.name,
          rating: equipment.rating,
          qty: equipment.qty,
          status: equipment.status,
          image: equipment.image,
          booking_id: equipment.booking_id,
          price: _price
        };

        list.push(_equipment);
      }

      return res.json(list);
    }
    return res.status(404).send('No data found');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  PUT api/equipments/:id
//@dec    change status of a equipment (which is used to delete/booked/rapiring/returned/active a equipment)
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
      let isAvailable = await Equipment.getEquipmentById(id);
      if (isAvailable) {
        let sucess = await Equipment.statusChange(id, status);
        if (sucess) {
          let editedEquipment = await Equipment.getEquipmentById(id);
          return res.json(editedEquipment);
        }
        return res.status(400).send('Status can not be changed');
      }
      return res.status(404).json({ msg: 'equipment not found' });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server error');
    }
  }
);

//@route  GET api/equipments/:id
//@dec    get an equipment
//@access public

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const equipment = await Equipment.getEquipmentById(id);
    if (equipment) {
      const _amount = await Price.getById(equipment.price_id);
      let _price = _amount.amount;

      let _equipment = {
        id: equipment.id,
        name: equipment.name,
        rating: equipment.rating,
        qty: equipment.qty,
        status: equipment.status,
        image: equipment.image,
        booking_id: equipment.booking_id,
        price: _price
      };

      return res.json(_equipment);
    }
    return res.status(404).send('No data found');
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  GET api/equipments/img/:id
//@dec    get a equipment image
//@access public
router.get('/img/:imgName', async (req, res, next) => {
  const { imgName } = req.params;
  let file_path = path.resolve(
    `${__dirname}/../../public/images/equipments/${imgName}`
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

//@route  PATCH api/equipments/:id
//@dec    update an equipment
//@access private - admin only
router.patch(
  '/:id',
  admin,
  [
    check('qty', 'qty is required')
      .not()
      .isEmpty(),
    check('price_id', 'price_id is required')
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
      const { qty, price_id } = req.body;
      const isAvailable = await Equipment.getEquipmentById(id);
      if (!isAvailable) {
        return res.status(404).send('Equipment not found');
      }
      const update = await Equipment.updateAdminEquipment(id, qty, price_id);
      if (!update) {
        res.status(500).send('Server error');
      }
      res.json(update);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
