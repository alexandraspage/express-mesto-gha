const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const NOT_FOUND_ERROR = 404;

const app = express();

app.use(express.json());

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '648a1d7463762d44fb10b653',
  };

  next();
});

app.use(userRoutes);

app.use(cardRoutes);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: '404 ошибка' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
