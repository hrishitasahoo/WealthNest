const { verifyToken } = require('../utils/jwt');
const { AppError } = require('../utils/AppError');

function requireAuth(req, res, next) {
  try {
    let token = req.cookies && req.cookies.wn_token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Your session has expired. Please log in again.', 401, 'SESSION_EXPIRED');
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return next(new AppError('Your session has expired. Please log in again.', 401, 'SESSION_EXPIRED'));
    }
    next(err);
  }
}

module.exports = { requireAuth };
