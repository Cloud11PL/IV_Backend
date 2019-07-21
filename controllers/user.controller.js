const bcrypt = require('bcrypt');
const User = require('../models/user.model');

exports.test = (req, res) => {
  res.send('Hello from Test!');
};

exports.create = (req, res) => {
  console.log(req.body);
  if (!req.body) {
    return res.status(400).send({
      message: 'Elo pomelo nie dziaua',
    });
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  console.log(hashedPassword);

  user.save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });

  return false;
};

exports.findAll = (req, res) => {
  console.log(req.body);
};

exports.findOne = (req, res) => {
  console.log(req.body);
};

exports.delete = (req, res) => {
  console.log(req.body);
};
