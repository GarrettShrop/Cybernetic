// models/Inventory.js
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Inventory', {
		UserId: {
			type: DataTypes.INTEGER,
			references: {
				// This is a reference to another model
				model: 'Users',
				// This is the column name of the referenced model
				key: 'id',
			},
		},
		ItemId: {
			type: DataTypes.INTEGER,
			references: {
				// This is a reference to another model
				model: 'Items',
				// This is the column name of the referenced model
				key: 'id',
			},
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	});
};
