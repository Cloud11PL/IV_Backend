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
    surname: req.body.surname,
    name: req.body.name,
    email: req.body.email,
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
  User.find({}).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.status(500).send({
      message: err.message,
    });
  });
  console.log(req.body);
};

exports.findOne = (req, res) => {
  console.log(req.params.userId);
  User.findById(req.params.userId).then((data) => {
    console.log(data);
    res.send(data);
  }).catch((err) => {
    res.status(500).send({
      message: err.message,
    });
  });
};

exports.delete = (req, res) => {
  console.log(req.body);
  res.send('xD');
};
