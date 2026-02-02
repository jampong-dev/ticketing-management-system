const sequelize = require('./config');

// Import models
const User = require('./User');
const Role = require('./Role');

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({
      alter: true, // DEV ONLY
    });

    console.log('✅ Roles & Users tables synced');
  } catch (error) {
    console.error('❌ DB sync error:', error);
    process.exit(1);
  }
};

Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

module.exports = initDb;