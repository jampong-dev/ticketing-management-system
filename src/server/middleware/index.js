const authMiddleware = require('./authMiddleware');
const authorizeMiddleware = require('./authorizeMiddleware');
const { validateRegister, validateLogin } = require('./validateInput');
const errorHandler = require('./errorHandler');

module.exports = {
  authenticate: authMiddleware,
  authorize: (...roles) => authorizeMiddleware(roles),
  validateRegister,
  validateLogin,
  errorHandler
};
