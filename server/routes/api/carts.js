const express = require('express');
const router = express.Router();

const auth = require('../../middlewares/auth');
const Equipment = require('../../models/Equipment');
const Vehicle = require('../../models/Vehicle');
const Price = require('../../models/Price');

//@route  POST api/carts/equipments
//@dec    get cart equipments
//@access private
router.post('/equipments', auth, async (req, res, next) => {
  try {
    const { equipment_ids } = req.body;

    let _equipmentList = [];

    for (const equ of equipment_ids) {
      const _equ = await Equipment.getEquipmentById(equ.id);
      if (_equ) {
        const _amount = await Price.getById(_equ.price_id);
        let _price = _amount.amount;
        let _equipment = {
          id: _equ.id,
          name: _equ.name,
          qty: equ.amount,
          price: _price
        };

        _equipmentList.push(_equipment);
      } else {
        return res.status(404).send('Data not found');
      }
    }

    return res.json(_equipmentList);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route  POST api/carts/vehicles
//@dec    get cart vehicles
//@access private
router.post('/vehicles', auth, async (req, res, next) => {
  try {
    const { vehicles_ids } = req.body;

    let _vehicleList = [];

    for (const id of vehicles_ids) {
      const _vehi = await Vehicle.getVehicleById(id);

      if (_vehi) {
        const _amount = await Price.getById(_vehi.price_id);
        let _price = _amount.amount;
        let _vehicle = {
          id: _vehi.id,
          name: _vehi.name,
          price: _price
        };

        _vehicleList.push(_vehicle);
      } else {
        return res.status(404).send('Data not found');
      }
    }

    return res.json(_vehicleList);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
