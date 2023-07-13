const router = require('express').Router();

const { NotFoundError } = require('../middlewares/error');
const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');

const userRoutes = require('./users');
const cardsRoutes = require('./cards');

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use(userRoutes);
router.use(cardsRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError());
});

module.exports = router;
