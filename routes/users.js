var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const verfyToken = require('./jwt/jwt_decode');

require('dotenv').config();

//getALL
router.get('/', async (req, res) => {
  try {
    let users = await userModel.find()

    return res.status(200).send({
      data: users,
      message: "get success"
    })

  } catch (err) {
    return res.status(err.status || 500).send({
      message: err.message
    })
  }
})

//getByID
router.get('/:id', async (req, res) => {
  try {

    let id = req.params.id
    let user = await userModel.findById(id)

    return res.status(200).send({
      data: user,
      message: "get by id success"
    })

  } catch (err) {
    return res.status(err.status || 500).send({
      message: err.message
    })
  }
})

//update
router.put('/:id', async (req, res) => {
  try {
    let id = req.params.id
    let body = req.body

    await userModel.updateOne(
      { _id: id },
      {
        $set: {
          user_id: body.user_id,
          username: body.username,
          password: body.password,
          fname: body.fname,
          lname: body.lname,
          age: body.age,
          sex: body.sex
        }
      }
    )

    let user = await userModel.findById(id)
    return res.status(200).send({
      data: user,
      message: "update-success"
    })


  } catch (err) {
    return res.status(err.status || 500).send({
      message: err.message
    })
  }
})

//delete
router.delete('/:id', async (req, res) => {
  try {
    let id = req.params.id

    await userModel.deleteOne({ _id: id })
    let user = await userModel.find()

    return res.status(200).send({
      data: user,
      message: "delete-success"
    })

  } catch (err) {
    return res.status(err.status || 500).send({
      message: err.message
    })
  }
})

router.get('/hello', (req, res) => {
  let decodeToken = req.auth
  
  res.send({
    data: detoken,
    message: `hello ${detoken.role} ${detoken.name}`
  })

})


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})

//single file
router.post('/upload/single', upload.single('img'), (req, res) => {
  return res.send({
    message: 'upload success'
  })
})

//array file
router.post('/upload/array', upload.array('img', 2), (req, res) => {
  return res.send({
    message: 'upload success'
  })
})

//multi file
router.post('/upload/fields', upload.fields([{ name: 'img' }, { name: 'file' }]), (req, res) => {
  return res.send({
    message: 'upload success'
  })
})

module.exports = router;