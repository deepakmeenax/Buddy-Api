const express = require('express');
const jwt = require('jsonwebtoken');

const Camp = require('../models/camp');
const { ensureAuth } = require('../middleware/checkauth');

const router = express.Router();

router.post('/reg/camp', ensureAuth, async (req, res) => {
  try {
    req.body.owner = req.user.id;
    const camp = await Camp.create(req.body);
    return res.status(201).json({
      success: true,
      data: camp,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//reg in camp as donor
router.get('/reg/in/camp/:id', ensureAuth, async (req, res) => {
  const _id = req.params.id;
  try {
    const camp = await Camp.findByIdAndUpdate(_id, {
      $push: { participant: req.user._id },
    });
    return res.status(201).json({
      id: req.user._id,
      success: true,
      data: camp,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//find all camps
router.get('/search/camp', async (req, res) => {
  try {
    const camps = await Camp.find();

    return res.status(200).json({
      success: true,
      count: camps.length,
      data: camps,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search/camp/detail/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const camps = await Camp.findById(id);

    return res.status(200).json({
      success: true,
      data: camps,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//find in redius of 50km where center is given location
router.get('/search/camp/:lat/:lng', async (req, res) => {
  const latitude = req.params.lat;
  const longitude = req.params.lng;
  let coords = [longitude, latitude];

  try {
    const camps = await Camp.find({
      location: { $geoWithin: { $centerSphere: [coords, 10000 / 6378] } },
    });

    return res.status(200).json({
      success: true,
      count: camps.length,
      data: camps,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
