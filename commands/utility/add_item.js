const { SlashCommandBuilder } = require('discord.js');
const { addItemToDB } = require('../../database/user_services.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('additem')
		.setDescription('Adds a new item to the shop')
		.addStringOption(option => option.setName('item_name').setDescription('The name of the item').setRequired(true))
		.addStringOption(option => option.setName('item_description').setDescription('A description of the item').setRequired(true))
		.addIntegerOption(option => option.setName('cost').setDescription('The cost of the item in points').setRequired(true)),
	async execute(interaction) {
		// Check if the user has the necessary permissions to add an item
		if (!interaction.member.permissions.has('ADMINISTRATOR')) {
			return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
		}

		const itemName = interaction.options.getString('item_name');
		const itemDescription = interaction.options.getString('item_description');
		const cost = interaction.options.getInteger('cost');

		try {
			await addItemToDB(itemName, itemDescription, cost);
			await interaction.reply({ content: 'Item added successfully!' });
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error adding the item.', ephemeral: true });
		}
	},
};
