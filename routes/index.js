var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

let checkUser = async (req, res, next) => {
  try {

    const { username, password } = req.body;
    const userDB = await userModel.findOne({ username: username });

    if (!userDB) {
      return res.status(400).send({ message: `ไม่พบผู้ใช้ ${username}` });
    }

    const isPasswordValid = await bcrypt.compare(password, userDB.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    const payload = {
      _id: userDB._id,
      username: username,
      role: userDB.role
    }

    const Jtoken = jwt.sign(payload, process.env.JWT_KEY);

    req.userSearch = ({
      token: Jtoken,
      // data: {
      //   _id: userDB._id,
      //   username: username,
      //   role: userDB.role
      // },
      message: "ล็อกอินสำเร็จแล้ว"
    })

    next()
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

router.post('/login', checkUser, async (req, res) => {
  try {
    let userSearch = req.userSearch

    res.status(200).send({
      data: userSearch,
    })

  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
});

router.post('/register', async (req, res) => {
  try {
    let body = req.body;

    const hashedPassword = await bcrypt.hash(body.password, 10);

    let new_user = new userModel({
      user_id: body.user_id,
      username: body.username,
      password: hashedPassword,
      fname: body.fname,
      lname: body.lname,
      age: body.age,
      sex: body.sex,
      role: body.role,
      email: body.email
    })

    let user = await new_user.save()

    return res.status(201).send({
      // data: user,
      message: "สร้างบันชีใหม่สำเร็จแล้ว"
    })

  } catch (err) {
    return res.status(err.status || 500).send({
      message: err.message
    })
  }

})


// router.post('/', function (req, res, next) {
//   const scores = req.body;
//   const result = calculateGradesAndGPA(scores);
//   res.send(result);
// });

// router.put('/', function (req, res, next) {
//   let query = req.query;
//   res.send(query)
//   // res.send('Hello Method PUT');
// });

// router.delete('/', function (req, res, next) {
//   res.send('Hello Method DELETE');
// });

module.exports = router;