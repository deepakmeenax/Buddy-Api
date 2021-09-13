const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {
  ensureAuth: async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
    try {
      const { _id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(_id);
      if (user) {
        req.user = user;
        next();
      } else {
        return res.sendStatus(403);
      }
    } catch (error) {
      console.log(error);
      return res.sendStatus(403);
    }
    // jwt.verify(token, process.env.JWT_SECRET, (err, _id) => {
    //   console.log(err);

    //   if (err) return res.sendStatus(403);

    //   req.user = user;

    //   next();
    // });
  },
};
