const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { ensureAuth } = require('../middleware/checkauth');

const router = express.Router();

//dashboard for user/donor/bloodbank
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//become donor add role donor and loc
router.post('/becomedonor', ensureAuth, async (req, res) => {
  try {
    const donor = await User.findByIdAndUpdate(req.user._id, {
      location: req.body.location,
      role: 'donor',
    });

    return res.status(200).json({
      success: true,
      data: donor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//add notify token for notification
router.post('/add/notifytoken', ensureAuth, async (req, res) => {
  try {
    const donor = await User.findByIdAndUpdate(req.user._id, {
      notifyToken: req.body.token,
    });

    return res.status(200).json({
      success: true,
      data: donor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//find donor in redius of 100km and notify them
router.get('/req/donor/:lat/:lng/:group', async (req, res) => {
  const bloodGroup = req.params.group;
  const latitude = req.params.lat;
  const longitude = req.params.lng;
  let coords = [longitude, latitude];

  try {
    const donors = await User.find({
      location: { $geoWithin: { $centerSphere: [coords, 100 / 6378] } },
      bloodGroup,
      role: 'donor'
    });

    return res.status(200).json({
      success: true,
      count: bloodbanks.length,
      data: bloodbanks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
