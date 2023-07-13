const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');

const User = require('../models/user');

const CREATED = 201;
const { UnauthorizedError, NotFoundError } = require('../middlewares/error');

const NO_ERROR = 200;

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => new NotFoundError('Not found'))
    .then((users) => res.status(NO_ERROR).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Not found'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Not found'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch(next);
};

const changeUserInfo = (req, res, next) => {
  const userId = req.user;
  const change = req.body;

  User.findByIdAndUpdate(userId, change, { new: true, runValidators: true })
    .orFail(new NotFoundError('Not found'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch(next);
};

const changeAvatar = (req, res, next) => {
  const userId = req.user;
  const change = req.body;

  User.findByIdAndUpdate(userId, change, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Not found'))
    .then((user) => res.status(NO_ERROR).send(user))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => next(new UnauthorizedError('Неправильный логин или пароль')))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, 'some-secret-key');
            res.cookie('jwt', jwt, { maxAge: 7 * 24 * 3600 * 1000, httpOnly: true, sameSite: true });

            res.send({ data: user });
          } else {
            return next(new UnauthorizedError('Неправильный логин или пароль'));
          }
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUserInfo,
  changeAvatar,
  getUser,
  login,
};
