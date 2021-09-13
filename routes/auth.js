const express = require('express');
const jwt = require('jsonwebtoken');
const client = require('twilio')(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);
const User = require('../models/user');

const router = express.Router();

router.post('/getcode', (req, res) => {
  const { number } = req.body;
  try {
    client.verify
      .services(process.env.VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${number}`,
        channel: 'sms',
      })
      .then(data => {
        res.status(200).send(data);
      });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.post('/verifycode', async (req, res) => {
  const { number, code } = req.body;
  try {
    const data = await client.verify
      .services(process.env.VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${number}`,
        code: code,
      });

    const user = await User.findOne({ phonenumber: number });
    let token = null;
    if (user) {
      token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    }

    return res.status(200).json({
      status: data.status,
      valid: data.valid,
      isLogin: token ? true : false,
      token: token,
      user: user
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

router.post('/singup', async (req, res) => {
  const { number, name } = req.body;
  try {
    const user = await User.create({
      phonenumber: number,
      name,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res.status(201).json({
      success: true,
      user: user,
      token: token,
      isLogin: token ? true : false,
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

module.exports = router;
