const Card = require('../models/card');
const { NotFoundError, ForbiddenError } = require('../middlewares/error');

const NO_ERROR = 200;
const CREATED = 201;

const getCards = (req, res, next) => {
  Card.find({})
    .populate('likes owner')
    .then((cards) => res.status(NO_ERROR).send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Not found'))
    .then((card) => {
      if (!card.owner._id.equals(req.user._id)) {
        next(new ForbiddenError('Нет прав на удаление'));
      } else {
        Card.deleteOne(card)
          .then((data) => res.status(NO_ERROR).send(data));
      }
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  console.log(req.user._id);
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((cards) => res.status(CREATED).send(cards))
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Not found'))
    .then((card) => res.status(NO_ERROR).send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Not found'))
    .then((card) => res.status(NO_ERROR).send(card))
    .catch(next);
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  dislikeCard,
  likeCard,
};
