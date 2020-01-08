const bagType = require('../models/bagType.model');


exports.create = (req, res) => {
  bagType.create(req.body, (err, idk) => {
    res.json(idk);
  });
};

exports.findAll = (req, res) => {
  bagType.find({}, (err, bags) => {
    if (err) {
      res.json(err);
    }
    res.json(bags);
  });
};
