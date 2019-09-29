const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const secretKey = require('../secretKey');

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

exports.authenticate = (req, res) => {
  console.log(req.body);
  if (!req.body) {
    return res.status(401).send({
      message: 'Wrong data',
    });
  }

  User.findOne({
    username: req.body.username,
  }, (err, user) => {
    console.log(user);
    if (err || user === null) {
      return res.status(401).send({
        message: 'No user found.',
      });
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ id: user._id }, secretKey,
        // {expiresIn: '1h' }
      );

      res.json({
        status: 'success',
        token,
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
      });
    } else {
      res.json({ status: 'fail' });
    }
  });
};

exports.authToken = (req, res) => {
  console.log(req.body);

  jwt.verify(req.body.token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).send({
        isAuthorized: false,
      });
    }
    console.log(decoded);
    res.status(200).send({
      isAuthorized: true,
    });
  });
  // console.log(verify);
  // res.status(200).send(verify);
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
