const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const _ = require('lodash');
const zip = require('express-zip');
const neatCsv = require('neat-csv');

const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');
const User = require('../../models/User');

//====================== Status ============================
//deleted - 0, active -1 , whitelisted - 2 , blacklisted -3
//isnew = 0 means user is not a new user, isnew =1 means a user is a new user
//==========================================================

//@route  POST api/users
//@dec    Create a user
//@access public
router.post(
  '/',
  [
    check('fullname', 'fullname is required').not().isEmpty(),
    check('dob', 'dob is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email', 'email is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, dob, email, password, contact, licensenumber } = req.body;

    // const suspendedLicense = await axios.get(
    //   `http://localhost:5050/api/licences`
    // );
    let csv_dir = `${__dirname}/../../public/license.csv`;
    try {
      fs.readFile(csv_dir, async (err, data) => {
        licencelist = await neatCsv(data);

        if (_.some(licencelist, { licensenumber }))
          return res
            .status(500)
            .json({ error: 'There is an issue in your license' });

        let licenceName = req.files.licence.name;
        let billName = req.files.bill.name;

        let licenceFile = req.files.licence;
        let billFile = req.files.bill;
        let img_dir = `${__dirname}/../../public/images/users/`;

        if (!fs.existsSync(img_dir)) {
          fs.mkdirSync(img_dir);
        }

        if (!req.files) {
          return res.status(500).json({ error: 'Photo upload failed' });
        } else {
          //renaming images
          let tmpLicenceName = licenceName.split('.');
          let licenceImageName = Date.now() + '1' + '.' + tmpLicenceName[1];

          let tmpBillName = billName.split('.');
          let billImageName = Date.now() + '2' + '.' + tmpBillName[1];

          licenceFile.mv(img_dir + licenceImageName, (err) => {
            if (err) {
              return res.status(500).send('Server error');
            }
          });
          billFile.mv(img_dir + billImageName, (err) => {
            if (err) {
              return res.status(500).send('Server error');
            }
          });
          const salt = await bcrypt.genSalt(10);
          encryptedPassword = await bcrypt.hash(password, salt);

          const newUser = {
            fullname,
            dob,
            email,
            contact,
            licence: licenceImageName,
            bill: billImageName,
            password: encryptedPassword,
            status: 1,
            role: 'client',
            isnew: 1,
            licensenumber
          };

          let result = await User.create(newUser);
          if (result) {
            const payload = {
              user: {
                id: result.insertId,
                email: newUser.email,
                status: newUser.status
              }
            };

            jwt.sign(
              payload,
              config.get('jwtSecret'),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        }
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

//@route  GET api/users
//@dec    get  users
//@access private-admin only
router.get('/', admin, async (req, res, next) => {
  try {
    let userList = await User.list();
    if (!userList) {
      return res.status(404).json({ msg: 'Users not found' });
    }
    return res.json(userList);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server error');
  }
});

//@route  PUT api/users/:id
//@dec    change status of a user (which is used to delete/blacklist/whitelist a user)
//@access private-admin
router.put(
  '/:id',
  admin,

  [check('status', 'status is required').not().isEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { status } = req.body;
      let isAvailable = await User.getUser(id);
      if (isAvailable) {
        let sucess = await User.statusChange(id, status);
        if (sucess) {
          let editedUser = await User.getUser(id);
          return res.json(editedUser);
        }
        return res.status(400).send('Status can not be changed');
      }
      return res.status(404).json({ msg: 'user not found' });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server error');
    }
  }
);
//@route  PATCH api/users/:id
//@dec    user update
//@access private
router.patch(
  '/:id',
  auth,
  auth,
  [
    check('fullname', 'fullname is required').not().isEmpty(),
    check('old_password', 'old_password is required').not().isEmpty(),
    check('new_password', 'new_password is required').not().isEmpty(),
    check('contact', 'contact is required').not().isEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { fullname, old_password, new_password, contact } = req.body;
      let isAvailable = await User.getUser(id);
      if (isAvailable) {
        const isMatch = await bcrypt.compare(
          old_password,
          isAvailable.password
        );
        if (!isMatch) {
          return res.status(400).json({
            msg: 'Invalid password'
          });
        }
        const salt = await bcrypt.genSalt(10);
        encryptedPassword = await bcrypt.hash(new_password, salt);
        const updatedData = {
          fullname,
          new_password: encryptedPassword,
          contact
        };
        let sucess = await User.update(id, updatedData);
        if (!sucess) {
          return res.status(400).send('User can not be updated');
        }
        let editedUser = await User.getUser(id);
        return res.json(editedUser);
      } else {
        return res.status(404).json({ msg: 'user not found' });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server error');
    }
  }
);

//@route  GET api/users/user/:id
//@dec    get a specific update
//@access private
router.get('/user/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getUser(id);
    if (!user) {
      return res.status(404).send('Data not found');
    }
    const _user = {
      id: user.id,
      fullname: user.fullname,
      contact: user.contact
    };
    res.json(_user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Sever error');
  }
});

//@route  GET api/users/user/licence/:id
//@dec    get licence image of a specific user
//@access private-admin only

router.get('/user/licence/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const isAvailable = await User.getUser(id);
    if (!isAvailable) {
      return res.status(404).send('User not found');
    }
    let licenceFile = isAvailable.licence;
    let licence_path = path.resolve(
      `${__dirname}/../../public/images/users/${licenceFile}`
    );
    if (!fs.existsSync(licence_path)) {
      return res.status(404).send('File not found');
    }
    res.sendFile(licence_path);
    // res.zip([
    //   {
    //     path: licence_path,
    //     name: licenceFile
    //   }
    // ]);
    // return;
  } catch (err) {
    console.log(err.message);
    res.status(500).res('Server error');
  }
});

//@route  GET api/users/user/bill/:id
//@dec    get bill image of a specific user
//@access private-admin only

router.get('/user/bill/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const isAvailable = await User.getUser(id);
    if (!isAvailable) {
      return res.status(404).send('User not found');
    }
    let billFile = isAvailable.bill;
    let bill_path = path.resolve(
      `${__dirname}/../../public/images/users/${billFile}`
    );
    if (!fs.existsSync(bill_path)) {
      return res.status(404).send('File not found');
    }
    res.sendFile(bill_path);
    // res.zip([
    //   {
    //     path: billFile,
    //     name: bill_path
    //   }
    // ]);
    return;
  } catch (err) {
    console.log(err.message);
    res.status(500).res('Server error');
  }
});

//@route  GET api/users/web/blocked
//@dec    get blocked users from insurance database
//@access private-admin only
router.get('/web/blocked', admin, async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5050/api/users`);
    if (!response.data) {
      return res.status(404).json({ msg: 'No blocked users found' });
    }
    return res.json(response.data);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server error');
  }
});
module.exports = router;
