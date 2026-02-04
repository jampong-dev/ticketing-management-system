const { DataTypes } = require('sequelize');
const sequelize = require('./config');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ticket_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    title:{
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {  
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: { 
        type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'),
        defaultValue: 'OPEN',
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
        defaultValue: 'MEDIUM', 
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true 
    },
    resolved_at: {
        type: DataTypes.DATE,
        allowNull: true 
    },
    closed_at: {
        type: DataTypes.DATE,
        allowNull: true 
    }
}, {
   tableName: 'tickets',
   timestamps: true,
   underscored: true,
});

module.exports = Ticket;