const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: 'Internal Server Error', err: err.message, stack: err.stack }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Пользователь не найден',
          });
      } else {
        res.status(500).send({ message: 'Internal Server Error', name: err.name, err: err.message });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Internal Server Error', name: err.name, err: err.message });
      }
    });
};

const changeUserInfo = (req, res) => {
  const userId = req.user;
  const change = req.body;

  User.findByIdAndUpdate(userId, change, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Пользователь не найден',
          });
      } else {
        res.status(500).send({ message: 'Internal Server Error', name: err.name, err: err.message });
      }
    });
};

const changeAvatar = (req, res) => {
  const userId = req.user;
  const change = req.body;

  User.findByIdAndUpdate(userId, change, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Пользователь не найден',
          });
      } else {
        res.status(500).send({ message: 'Internal Server Error', name: err.name, err: err.message });
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
