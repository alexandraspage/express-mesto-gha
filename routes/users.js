const router = require('express').Router();
const {
  getUsers, getUserById, createUser, changeUserInfo, changeAvatar, getUser, login,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/signup', createUser);
router.post('/signin', login);
router.patch('/users/me', changeUserInfo);
router.get('/users/me', getUser);
router.patch('/users/me/avatar', changeAvatar);

module.exports = router;
