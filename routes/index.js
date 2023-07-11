const router = require('express').Router();

const NOT_FOUND_ERROR = 404;
const auth = require('../middlewares/auth');

const { createUser, login } = require('../controllers/users');

const userRoutes = require('./users');
const cardsRoutes = require('./cards');

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use(userRoutes);
router.use(cardsRoutes);

router.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: '404 ошибка' });
});

module.exports = router;
