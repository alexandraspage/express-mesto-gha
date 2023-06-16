const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: 'Internal Server Error', err: err.message, stack: err.stack }));
};

const deleteCard = (req, res) => {
  Card.deleteOne(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Пользователь не найден',
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Internal Server Error', name: err.name, err: err.message });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user } }, { new: true })
    .then((card) => res.status(200).send(card))
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

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
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
  getCards,
  deleteCard,
  createCard,
  dislikeCard,
  likeCard,
};
