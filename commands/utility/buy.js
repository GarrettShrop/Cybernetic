const { SlashCommandBuilder } = require('discord.js');
const { getItemFromDB, deductPointsFromDB, addItemToInventory, getPointsFromDB } = require('../../database/user_services.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Allows you to purchase the item from the shop')
		.addStringOption(option =>
			option.setName('item_name')
				.setDescription('Name of the item you want to purchase')
				.setRequired(true)),
	async execute(interaction) {
		try {
			// Get the name of the item the user wants to buy
			const itemName = interaction.options.getString('item_name');

			// Fetch the item from the database
			const item = await getItemFromDB(itemName);

			if (!item) {
				await interaction.reply(`Sorry, we could not find an item with the name "${itemName}".`);
				return;
			}

			// Check if the user has enough points to buy the item
			const userPoints = await getPointsFromDB(interaction.user.id);

			if (userPoints < item.cost) {
				await interaction.reply(`Sorry, you do not have enough points to buy the ${itemName}. You currently have ${userPoints} points, but the ${itemName} costs ${item.cost} points.`);
				return;
			}

			// Deduct the cost of the item from the user's points and add the item to their inventory
			await deductPointsFromDB(interaction.user.id, item.cost);
			await addItemToInventory(interaction.user.id, item.id);

			await interaction.reply(`Congratulations! You have successfully bought the ${itemName} for ${item.cost} points. Enjoy your purchase!`);
		}
		catch (err) {
			console.log(err);
		}
	},

};