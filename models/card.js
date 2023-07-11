/* eslint-disable no-undef */
const mongoose = require('mongoose');
const validator = require('validator');

function validateLink(avatar) {
  const regExp = /https?:\/\/\w+.+#?/;
  return regExp.test(avatar);
}

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: [validateLink, 'Введите ссылку'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  },
  ],
  createdAt: {
    type: Date,
    default: Date.now,

  },
});

module.exports = mongoose.model('card', cardSchema);
