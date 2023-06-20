const Card = require('../models/card');

const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const INTERNAL_SERVER_ERROR = 500;
const NO_ERROR = 200;

const getCards = (req, res) => {
  Card.find({})
    .populate('likes owner')
    .then((cards) => res.status(NO_ERROR).send(cards))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      console.log(err.name, err.message);
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((data) => res.status(NO_ERROR).send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Карточка не найдена',
            err: err.name,
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      }
    });
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((cards) => res.status(NO_ERROR).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user } },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(NO_ERROR).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Карточка не найдена',
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user } },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(NO_ERROR).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Not found') {
        res
          .status(NOT_FOUND_ERROR)
          .send({
            message: 'Карточка не найдена',
          });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error' });
      }
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  dislikeCard,
  likeCard,
};
