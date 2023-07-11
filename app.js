const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/error');
//  const body Parser = require('body-parser');

const app = express();

app.use(express.json());

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

//  app.use(bodyParser.json());
app.use(cookieParser());

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
