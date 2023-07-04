// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
	// Model attributes are defined here
	username: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	points: {
		type: DataTypes.INTEGER,
		// allowNull defaults to true
	},
}, {
	// Other model options go here
});

module.exports = User;
