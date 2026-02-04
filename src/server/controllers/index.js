const authController = require('./authController');
const ticketController = require('./ticketController');

module.exports = {
  ...authController,
  ...ticketController
};