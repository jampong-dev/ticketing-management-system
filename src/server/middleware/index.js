const authMiddleware = require('./authMiddleware');
const authorizeMiddleware = require('./authorizeMiddleware');
const { validateRegister, validateLogin } = require('./validateInput');
const errorHandler = require('./errorHandler');

module.exports = {
  authMiddleware,
  authorizeMiddleware,
  validateRegister,
  validateLogin,
  errorHandler
};
