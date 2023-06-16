const router = require('express').Router();
const {
  getUsers, getUserById, createUser, changeUserInfo, changeAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/me', changeUserInfo);
router.patch('/users/me/avatar', changeAvatar);

module.exports = router;
