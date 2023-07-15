const mongoose = require('mongoose');
const validator = require('validator');

function validateLink(avatar) {
  const regExp = /https?:\/\/\w+.+?.ru#?/;
  return regExp.test(avatar);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://practicum.yandex.ru/learn/web/courses/4da123a7-d4aa-4bc2-b299-b48f921da09c/sprints/82525/topics/332a78cb-d0ee-4ef6-aa41-388504bfb629/lessons/232f6a79-0075-4280-9689-f198e0b66744/#:~:text=avatar%20%E2%80%94-,%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B0,-%3B',
    validate: [validateLink, 'Введите ссылку'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Введите почту правильно'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
