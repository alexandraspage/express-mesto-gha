class NotFoundError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Не найдено';
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Некорректные данные';
    this.statusCode = 400;
  }
}

class InternalServerError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Ошибка на сервере';
    this.statusCode = 500;
  }
}

class UnauthorizedError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Неправильный логин или пароль';
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Доступ запрещен';
    this.statusCode = 403;
  }
}

class EmailError extends Error {
  constructor(err) {
    super(err);
    this.message = 'Пользователь с такой почтой уже существует';
    this.statusCode = 409;
  }
}

const errorHandler = (err, req, res, next) => {
  let error;
  console.log({ error2: err });

  if (err.message === 'Not found' || err.statusCode === 404) {
    error = new NotFoundError(err);
  } else if (err._message === 'card validation failed' || err.name === 'CastError' || err._message === 'user validation failed' || err._message === 'Validation failed') {
    error = new BadRequestError(err);
  } else if (err.statusCode === 401) {
    error = new UnauthorizedError(err);
  } else if (err.message === 'jwt must be provided' || err.statusCode === 403) {
    error = new ForbiddenError(err);
  } else if (err.code === 11000) {
    error = new EmailError(err);
  } else {
    error = new InternalServerError(err);
  }

  res.status(error.statusCode).send({ message: error.message });
  next();
};

module.exports = {
  errorHandler, UnauthorizedError, NotFoundError, ForbiddenError,
};
