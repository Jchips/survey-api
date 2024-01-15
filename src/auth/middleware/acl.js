'use strict';

// makes sure the capability is in the user's array of capabilities
module.exports = (capabilities) => {
  return (req, res, next) => {
    try {
      if (req.user.capabilities.includes(capabilities)) {
        next();
      } else {
        res.status(403).send('Access denied');
      }
    } catch (err) {
      next(err);
    }
  };
};