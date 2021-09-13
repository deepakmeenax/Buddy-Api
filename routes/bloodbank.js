const express = require('express');
const jwt = require('jsonwebtoken');

const BloodBank = require('../models/bloodbank');
const { ensureAuth } = require('../middleware/checkauth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      griting: 'welcome to Buddy Api',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reg/bloodbank', ensureAuth, async (req, res) => {
  try {
    req.body.owner = req.user.id;
    const bloodbank = await BloodBank.create(req.body);
    return res.status(201).json({
      success: true,
      data: bloodbank,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search/bloodbank', async (req, res) => {
  try {
    const Banks = await BloodBank.find();

    return res.status(200).json({
      success: true,
      count: Banks.length,
      data: Banks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//find in redius of 50km
router.get('/search/bloodbank/within/:lat/:lng', async (req, res) => {
  const latitude = req.params.lat;
  const longitude = req.params.lng;
  let coords = [longitude, latitude];
  console.log(latitude);
  console.log(longitude);

  try {
    const bloodbanks = await BloodBank.find({
      location: { $geoWithin: { $centerSphere: [coords, 10000 / 6378] } },
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

//find in redius of 50km and bloodgroup type given
router.get('/search/bloodbank/withtype/:lat/:lng/:group', async (req, res) => {
  const group = req.params.group;
  const latitude = req.params.lat;
  const longitude = req.params.lng;
  console.log(latitude);
  console.log(longitude);
  let coords = [longitude, latitude];

  try {
    const bloodbanks = await BloodBank.find({
      location: { $geoWithin: { $centerSphere: [coords, 10000 / 6378] } },
      blood: [{ group, $gte: ['value', 1] }],
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
