const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 1200;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose');
const dbConfig = require('./config/database.config');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected!');
}).catch((err) => {
  console.log(err);
  process.exit();
});

app.get('/', (req, res) => {
  res.json({ message: 'xDDDDDDDDDDDDDDDDDDDDD ELO MORDO' });
});

require('./routes/user.route')(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
