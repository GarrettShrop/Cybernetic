// models/Item.js
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Item', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		description: DataTypes.STRING,
	});
};
