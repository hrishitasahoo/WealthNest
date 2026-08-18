const { AppError } = require('../utils/AppError');

function errorHandler(err, req, res, next) {

  console.error('[error]', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code
    });
  }

  if (err && err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        return res.status(409).json({
          success: false,
          message: 'This information already exists in our records.',
          code: 'DUPLICATE_ENTRY'
        });
      case 'ECONNREFUSED':
      case 'PROTOCOL_CONNECTION_LOST':
        return res.status(503).json({
          success: false,
          message: 'We could not connect to the database right now. Please try again shortly.',
          code: 'DB_UNAVAILABLE'
        });
      default:
        break;
    }
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong on our end. Please try again in a moment.',
    code: 'SERVER_ERROR'
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'The requested resource could not be found.',
    code: 'NOT_FOUND'
  });
}

module.exports = { errorHandler, notFoundHandler };
