const User = require('../models/user');

const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const INTERNAL_SERVER_ERROR = 500;
const NO_ERROR = 200;

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => new Error('Not found'))
    .then((users) => res.status(NO_ERROR).send(users))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Пользователь не найден',
          });
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      console.log(err.name, err.message);
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Пользователь не найден',
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(NO_ERROR).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      }
    });
};

const changeUserInfo = (req, res) => {
  const userId = req.user;
  const change = req.body;

  User.findByIdAndUpdate(userId, change, { new: true, runValidators: true })
    .orFail(new Error('Not found'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Пользователь не найден',
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      }
    });
};

const changeAvatar = (req, res) => {
  const userId = req.user;
  const change = req.body;

  User.findByIdAndUpdate(userId, change, { new: true, runValidators: true })
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Пользователь не найден',
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUserInfo,
  changeAvatar,
};
