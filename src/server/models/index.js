const sequelize = require('./config');

// Import models
const User = require('./User');
const Role = require('./Role');
const Ticket = require('./Ticket');

// Role-User Relationship
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// User-Ticket Relationship (Created By)
User.hasMany(Ticket, { foreignKey: 'created_by', as: 'created_tickets' });
Ticket.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({
      alter: true, // DEV ONLY
    });
    
    console.log('✅ DB synchronized');
  } catch (error) {
    console.error('❌ DB sync error:', error);
    process.exit(1);
  }
};


module.exports = initDb;